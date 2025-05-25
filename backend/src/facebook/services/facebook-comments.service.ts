import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookGraphService, FacebookComment as GraphComment } from './facebook-graph.service';
import { FacebookPagesService } from './facebook-pages.service';
import { ReplyToCommentDto, CommentFiltersDto, CommentActionDto } from '../dto/facebook-comment.dto';
import { FacebookComment, CommentStatus, CommentType } from '@prisma/client';

export interface CommentWithReplies extends FacebookComment {
  replies?: FacebookComment[];
  replyCount?: number;
}

export interface CommentStats {
  totalComments: number;
  pendingComments: number;
  hiddenComments: number;
  repliedComments: number;
  postsWithComments: number;
}

@Injectable()
export class FacebookCommentsService {
  private readonly logger = new Logger(FacebookCommentsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly facebookGraphService: FacebookGraphService,
    private readonly facebookPagesService: FacebookPagesService,
  ) {}

  /**
   * Get comments for a specific post
   */
  async getPostComments(
    userId: number,
    pageId: string,
    postId: string,
    limit: number = 25,
    after?: string,
  ): Promise<{ comments: CommentWithReplies[]; nextCursor?: string }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Get comments from Facebook API
      const response = await this.facebookGraphService.getPostComments(
        postId,
        pageAccessToken,
        limit,
        after,
      );

      if (!response.data) {
        return { comments: [] };
      }

      // Sync comments to database and return with local data
      const comments = await this.syncCommentsToDatabase(pageId, postId, response.data);

      // Get replies for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await this.prismaService.facebookComment.findMany({
            where: {
              facebookPageId: pageId,
              parentCommentId: comment.id,
            },
            orderBy: { createdAt: 'asc' },
          });

          return {
            ...comment,
            replies,
            replyCount: replies.length,
          };
        }),
      );

      return {
        comments: commentsWithReplies,
        nextCursor: response.paging?.cursors?.after,
      };
    } catch (error) {
      this.logger.error('Error getting post comments:', error);
      throw error;
    }
  }

  /**
   * Get comments with filters
   */
  async getComments(
    userId: number,
    pageId: string,
    filters: CommentFiltersDto,
  ): Promise<{ comments: CommentWithReplies[]; total: number }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Build where clause
      const where: any = {
        facebookPageId: pageId,
      };

      if (filters.postId) {
        where.postId = filters.postId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.type) {
        where.type = filters.type;
      }

      if (filters.parentCommentId !== undefined) {
        where.parentCommentId = filters.parentCommentId;
      }

      if (filters.fromDate) {
        where.createdAt = {
          ...where.createdAt,
          gte: new Date(filters.fromDate),
        };
      }

      if (filters.toDate) {
        where.createdAt = {
          ...where.createdAt,
          lte: new Date(filters.toDate),
        };
      }

      if (filters.search) {
        where.content = {
          contains: filters.search,
          mode: 'insensitive',
        };
      }

      // Get comments and total count
      const [comments, total] = await Promise.all([
        this.prismaService.facebookComment.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: filters.offset || 0,
          take: filters.limit || 25,
        }),
        this.prismaService.facebookComment.count({ where }),
      ]);

      // Add reply counts
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replyCount = await this.prismaService.facebookComment.count({
            where: {
              facebookPageId: pageId,
              parentCommentId: comment.id,
            },
          });

          return {
            ...comment,
            replyCount,
          };
        }),
      );

      return { comments: commentsWithReplies, total };
    } catch (error) {
      this.logger.error('Error getting comments with filters:', error);
      throw error;
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(
    userId: number,
    pageId: string,
    commentId: string,
    replyDto: ReplyToCommentDto,
  ): Promise<FacebookComment> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get the original comment
      const originalComment = await this.prismaService.facebookComment.findFirst({
        where: {
          id: commentId,
          facebookPageId: pageId,
        },
      });

      if (!originalComment) {
        throw new NotFoundException('Comment not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Reply via Facebook API
      const response = await this.facebookGraphService.replyToComment(
        originalComment.facebookCommentId,
        pageAccessToken,
        replyDto.content,
      );      // Create local reply record
      const reply = await this.prismaService.facebookComment.create({
        data: {
          id: response.id, // Use Facebook comment ID as primary key
          facebookPageId: pageId,
          facebookCommentId: response.id,
          postId: originalComment.postId,
          message: replyDto.content, // Required field
          content: replyDto.content,
          fromId: page.facebookPageId,
          fromName: page.name,
          type: CommentType.REPLY,
          status: CommentStatus.PUBLISHED,
          parentCommentId: commentId,
          likeCount: 0,
          createdTime: new Date(), // Required field
          createdAt: new Date(),
          page: {
            connect: { id: pageId } // Required page relationship
          }
        },
      });

      // Update original comment reply status
      await this.prismaService.facebookComment.update({
        where: { id: commentId },
        data: { hasReply: true },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'COMMENT_REPLIED', {
        pageId,
        commentId,
        replyId: reply.id,
        content: replyDto.content.substring(0, 100),
      });

      this.logger.log(`Reply sent to comment ${commentId} from page ${page.name}`);
      return reply;
    } catch (error) {
      this.logger.error('Error replying to comment:', error);
      throw error;
    }
  }

  /**
   * Hide a comment
   */
  async hideComment(
    userId: number,
    pageId: string,
    commentId: string,
  ): Promise<{ success: boolean }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get the comment
      const comment = await this.prismaService.facebookComment.findFirst({
        where: {
          id: commentId,
          facebookPageId: pageId,
        },
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Hide via Facebook API
      const response = await this.facebookGraphService.hideComment(
        comment.facebookCommentId,
        pageAccessToken,
      );

      if (response.success) {
        // Update local record
        await this.prismaService.facebookComment.update({
          where: { id: commentId },
          data: {
            status: CommentStatus.HIDDEN,
            hiddenAt: new Date(),
          },
        });

        // Log activity
        await this.logActivity(page.facebookUserId, 'COMMENT_HIDDEN', {
          pageId,
          commentId,
          postId: comment.postId,
        });

        this.logger.log(`Comment ${commentId} hidden on page ${page.name}`);
      }

      return response;
    } catch (error) {
      this.logger.error('Error hiding comment:', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(
    userId: number,
    pageId: string,
    commentId: string,
  ): Promise<{ success: boolean }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get the comment
      const comment = await this.prismaService.facebookComment.findFirst({
        where: {
          id: commentId,
          facebookPageId: pageId,
        },
      });

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Delete via Facebook API
      const response = await this.facebookGraphService.deleteComment(
        comment.facebookCommentId,
        pageAccessToken,
      );

      if (response.success) {
        // Update local record (soft delete)
        await this.prismaService.facebookComment.update({
          where: { id: commentId },
          data: {
            status: CommentStatus.DELETED,
            deletedAt: new Date(),
          },
        });

        // Log activity
        await this.logActivity(page.facebookUserId, 'COMMENT_DELETED', {
          pageId,
          commentId,
          postId: comment.postId,
        });

        this.logger.log(`Comment ${commentId} deleted on page ${page.name}`);
      }

      return response;
    } catch (error) {
      this.logger.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Bulk action on comments
   */
  async bulkAction(
    userId: number,
    pageId: string,
    commentIds: string[],
    action: CommentActionDto,
  ): Promise<{ success: number; failed: number }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      let success = 0;
      let failed = 0;

      for (const commentId of commentIds) {
        try {
          switch (action.action) {
            case 'hide':
              await this.hideComment(userId, pageId, commentId);
              success++;
              break;
            case 'delete':
              await this.deleteComment(userId, pageId, commentId);
              success++;
              break;
            case 'approve':
              await this.approveComment(userId, pageId, commentId);
              success++;
              break;
            default:
              failed++;
          }
        } catch (error) {
          this.logger.error(`Bulk action failed for comment ${commentId}:`, error);
          failed++;
        }
      }

      // Log activity
      await this.logActivity(page.facebookUserId, 'COMMENT_BULK_ACTION', {
        pageId,
        action: action.action,
        commentIds,
        success,
        failed,
      });

      return { success, failed };
    } catch (error) {
      this.logger.error('Error performing bulk action:', error);
      throw error;
    }
  }

  /**
   * Approve a comment (change from pending to published)
   */
  async approveComment(
    userId: number,
    pageId: string,
    commentId: string,
  ): Promise<FacebookComment> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Update comment status
      const comment = await this.prismaService.facebookComment.update({
        where: {
          id: commentId,
          facebookPageId: pageId,
        },
        data: {
          status: CommentStatus.PUBLISHED,
          approvedAt: new Date(),
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'COMMENT_APPROVED', {
        pageId,
        commentId,
        postId: comment.postId,
      });

      return comment;
    } catch (error) {
      this.logger.error('Error approving comment:', error);
      throw error;
    }
  }

  /**
   * Get comment statistics
   */
  async getCommentStats(
    userId: number,
    pageId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<CommentStats> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Build date filter
      const dateFilter: any = {};
      if (fromDate || toDate) {
        dateFilter.createdAt = {};
        if (fromDate) dateFilter.createdAt.gte = fromDate;
        if (toDate) dateFilter.createdAt.lte = toDate;
      }

      // Get statistics
      const [
        totalComments,
        pendingComments,
        hiddenComments,
        repliedComments,
        postsWithComments,
      ] = await Promise.all([
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, status: CommentStatus.PENDING, ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, status: CommentStatus.HIDDEN, ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, hasReply: true, ...dateFilter },
        }),
        this.prismaService.facebookComment.groupBy({
          by: ['postId'],
          where: { facebookPageId: pageId, ...dateFilter },
        }).then(result => result.length),
      ]);

      return {
        totalComments,
        pendingComments,
        hiddenComments,
        repliedComments,
        postsWithComments,
      };
    } catch (error) {
      this.logger.error('Error getting comment statistics:', error);
      throw error;
    }
  }

  /**
   * Sync comments from Facebook API to database
   */
  private async syncCommentsToDatabase(
    pageId: string,
    postId: string,
    comments: GraphComment[],
  ): Promise<FacebookComment[]> {
    const syncedComments: FacebookComment[] = [];

    for (const comment of comments) {
      try {
        // Check if comment already exists
        const existingComment = await this.prismaService.facebookComment.findFirst({
          where: {
            facebookPageId: pageId,
            facebookCommentId: comment.id,
          },
        });

        if (existingComment) {
          syncedComments.push(existingComment);
          continue;
        }

        // Determine comment type
        const commentType = comment.parent ? CommentType.REPLY : CommentType.COMMENT;        // Create new comment
        const newComment = await this.prismaService.facebookComment.create({
          data: {
            id: comment.id, // Use Facebook comment ID as primary key
            facebookPageId: pageId,
            facebookCommentId: comment.id,
            postId,
            message: comment.message, // Required field
            content: comment.message,
            fromId: comment.from.id,
            fromName: comment.from.name,
            type: commentType,
            status: CommentStatus.PUBLISHED,
            parentCommentId: comment.parent?.id,
            likeCount: comment.like_count || 0,
            canHide: comment.can_hide || false,
            canRemove: comment.can_remove || false,
            createdTime: new Date(comment.created_time), // Required field
            createdAt: new Date(comment.created_time),
            page: {
              connect: { id: pageId } // Required page relationship
            }
          },
        });

        syncedComments.push(newComment);
      } catch (error) {
        this.logger.error(`Error syncing comment ${comment.id}:`, error);
      }
    }

    return syncedComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  /**
   * Log activity
   */
  private async logActivity(
    facebookUserId: string,
    action: string,
    details: Record<string, any>,
  ): Promise<void> {
    try {
      await this.prismaService.facebookActivityLog.create({
        data: {
          facebookUserId,
          action,
          details,
          entityType: 'comment', // Required field
          createdAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error logging activity:', error);
      // Don't throw error for logging failures
    }
  }

  /**
   * Auto-moderate comments (if enabled)
   */
  async processAutoModeration(
    pageId: string,
    comment: FacebookComment,
  ): Promise<void> {
    try {
      // Get page settings
      const page = await this.prismaService.facebookPage.findUnique({
        where: { id: pageId },
      });

      if (!page || !page.settings || !(page.settings as any).moderateComments) {
        return;
      }      // Simple auto-moderation logic
      const moderationKeywords = ['spam', 'scam', 'fake', 'terrible', 'worst'];
      const content = (comment.content || '').toLowerCase();
      
      const hasSpamKeywords = moderationKeywords.some(keyword => 
        content.includes(keyword)
      );

      if (hasSpamKeywords) {
        // Hide the comment
        await this.prismaService.facebookComment.update({
          where: { id: comment.id },
          data: {
            status: CommentStatus.HIDDEN,
            hiddenAt: new Date(),
          },
        });

        // Try to hide on Facebook too
        try {
          const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);
          await this.facebookGraphService.hideComment(
            comment.facebookCommentId,
            pageAccessToken,
          );
        } catch (error) {
          this.logger.warn('Failed to hide comment on Facebook:', error);
        }

        this.logger.log(`Auto-moderated comment ${comment.id} for spam keywords`);
      }
    } catch (error) {
      this.logger.error('Error processing auto-moderation:', error);
    }
  }
}
