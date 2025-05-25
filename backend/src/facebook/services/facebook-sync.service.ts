import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookGraphService, FacebookPageInfo, FacebookMessage, FacebookComment } from './facebook-graph.service';
import { FacebookPagesService } from './facebook-pages.service';
import { FacebookMessagesService } from './facebook-messages.service';
import { FacebookCommentsService } from './facebook-comments.service';
import { ConfigService } from '@nestjs/config';

export enum SyncEntityType {
  PAGES = 'pages',
  MESSAGES = 'messages',
  COMMENTS = 'comments',
  ALL = 'all'
}

export interface SyncResult {
  success: boolean;
  message: string;
  data: {
    pagesCount: number;
    messagesCount: number;
    commentsCount: number;
    startTime: Date;
    endTime: Date;
    duration: number;
  };
  errors: string[];
}

// Interface for sync options
export interface SyncOptions {
  userId: number;
  facebookUserId: string;
  entityTypes?: SyncEntityType[];
  forceRefresh?: boolean;
  limit?: number;
  since?: Date;
}

// Mock interface for posts since it's not defined in the graph service
interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
}

// Extended Facebook comment interface with replies
interface ExtendedFacebookComment extends FacebookComment {
  comments?: {
    data: FacebookComment[];
  };
}

@Injectable()
export class FacebookSyncService {
  private readonly logger = new Logger(FacebookSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly graphService: FacebookGraphService,
    private readonly pagesService: FacebookPagesService,
    private readonly messagesService: FacebookMessagesService,
    private readonly commentsService: FacebookCommentsService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Synchronize Facebook data for a user
   */
  async syncUserData(options: SyncOptions): Promise<SyncResult> {
    this.logger.log(`Starting Facebook data sync for user ID ${options.userId} (${options.facebookUserId})`);
    
    const startTime = new Date();
    const errors: string[] = [];
    const result: SyncResult = {
      success: true,
      message: 'Sync completed successfully',
      data: {
        pagesCount: 0,
        messagesCount: 0,
        commentsCount: 0,
        startTime,
        endTime: new Date(),
        duration: 0
      },
      errors: []
    };
    
    try {
      // Get Facebook user
      const facebookUser = await this.prisma.facebookUser.findUnique({
        where: { id: options.facebookUserId }
      });
      
      if (!facebookUser) {
        throw new BadRequestException(`Facebook user with ID ${options.facebookUserId} not found`);
      }
      
      // Determine which entities to sync
      const entitiesToSync = options.entityTypes || [SyncEntityType.ALL];
      const syncAll = entitiesToSync.includes(SyncEntityType.ALL);
      
      // Sync Facebook Pages
      if (syncAll || entitiesToSync.includes(SyncEntityType.PAGES)) {
        try {
          const pagesResult = await this.syncPages(facebookUser.id, facebookUser.accessToken, options.forceRefresh);
          result.data.pagesCount = pagesResult.count;
        } catch (error) {
          this.logger.error(`Error syncing pages: ${error.message}`, error.stack);
          errors.push(`Failed to sync pages: ${error.message}`);
        }
      }
      
      // Get all connected pages
      const pages = await this.prisma.facebookPage.findMany({
        where: { facebookUserId: facebookUser.id }
      });
      
      // Sync Facebook Messages for each page
      if (syncAll || entitiesToSync.includes(SyncEntityType.MESSAGES)) {
        let totalMessages = 0;
        
        for (const page of pages) {
          try {
            const messagesResult = await this.syncMessages(
              page.id, 
              page.accessToken, 
              options.limit || 100,
              options.since
            );
            totalMessages += messagesResult.count;
          } catch (error) {
            this.logger.error(`Error syncing messages for page ${page.name}: ${error.message}`, error.stack);
            errors.push(`Failed to sync messages for page ${page.name}: ${error.message}`);
          }
        }
        
        result.data.messagesCount = totalMessages;
      }
      
      // Sync Facebook Comments for each page
      if (syncAll || entitiesToSync.includes(SyncEntityType.COMMENTS)) {
        let totalComments = 0;
        
        for (const page of pages) {
          try {
            const commentsResult = await this.syncComments(
              page.id, 
              page.accessToken,
              options.limit || 100,
              options.since
            );
            totalComments += commentsResult.count;
          } catch (error) {
            this.logger.error(`Error syncing comments for page ${page.name}: ${error.message}`, error.stack);
            errors.push(`Failed to sync comments for page ${page.name}: ${error.message}`);
          }
        }
        
        result.data.commentsCount = totalComments;
      }
      
      // Update last sync time for Facebook user
      await this.prisma.facebookUser.update({
        where: { id: facebookUser.id },
        data: { lastSyncAt: new Date() }
      });
        // Create activity log
      await this.createSyncActivityLog({
        userId: options.userId,
        facebookUserId: facebookUser.id,
        action: 'sync',
        entityType: 'all',
        details: {
          pagesCount: result.data.pagesCount,
          messagesCount: result.data.messagesCount,
          commentsCount: result.data.commentsCount,
          syncOptions: options
        },
        status: errors.length > 0 ? 'partial' : 'success',
        errorMessage: errors.length > 0 ? errors.join('; ') : undefined
      });
      
    } catch (error) {
      this.logger.error(`Error during Facebook data sync: ${error.message}`, error.stack);
      result.success = false;
      result.message = `Sync failed: ${error.message}`;
      errors.push(error.message);
    }
    
    // Calculate duration and complete result
    const endTime = new Date();
    result.data.endTime = endTime;
    result.data.duration = endTime.getTime() - startTime.getTime();
    
    if (errors.length > 0) {
      result.errors = errors;
      if (result.success) {
        result.message = 'Sync completed with some errors';
      }
    }
    
    this.logger.log(`Facebook data sync completed in ${result.data.duration}ms`);
    return result;
  }
    /**
   * Sync Facebook Pages for a user
   */
  private async syncPages(facebookUserId: string, accessToken: string, forceRefresh = false): Promise<{ count: number }> {
    this.logger.log(`Syncing Facebook Pages for user ${facebookUserId}`);
    
    // Get pages from Facebook API
    const pages = await this.graphService.getUserPages(facebookUserId);
    
    // Process and save each page
    let count = 0;
    for (const page of pages) {
      try {
        // Get page details directly from the page object, as getPageDetails doesn't exist
        const pageDetail = page;
        
        // Check if page already exists
        const existingPage = await this.prisma.facebookPage.findFirst({
          where: { facebookPageId: page.id }
        });
        
        // Prepare page data
        const pageData = {
          name: page.name,
          category: page.category || 'Unknown',
          pictureUrl: page.picture?.data?.url,
          about: page.about,
          website: page.website,
          phone: page.phone,
          email: page.email,
          fanCount: page.fan_count || 0,
          accessToken: page.access_token,
          facebookUserId,
          lastSyncAt: new Date()
        };
        
        if (existingPage) {
          // Update existing page
          await this.prisma.facebookPage.update({
            where: { id: existingPage.id },
            data: pageData
          });
        } else {
          // Create new page
          await this.prisma.facebookPage.create({
            data: {
              id: page.id,
              facebookPageId: page.id,
              ...pageData
            }
          });
        }
        
        count++;
      } catch (error) {
        this.logger.error(`Error processing page ${page.name}: ${error.message}`);
        throw error;
      }
    }
    
    this.logger.log(`Synced ${count} Facebook Pages for user ${facebookUserId}`);
    return { count };
  }
    /**
   * Sync Facebook Messages for a page
   */
  private async syncMessages(
    pageId: string, 
    pageAccessToken: string, 
    limit = 100,
    since?: Date
  ): Promise<{ count: number }> {
    this.logger.log(`Syncing Facebook Messages for page ${pageId}`);
    
    // Get conversations from Facebook API
    const conversationsResponse = await this.graphService.getPageConversations(pageId, pageAccessToken, limit);
    const conversationsData = conversationsResponse.data || [];
    
    let count = 0;
    
    // Process each conversation
    if (conversationsData && Array.isArray(conversationsData)) {
      for (const conversation of conversationsData) {
        try {
          // Get messages in this conversation
          const messagesResponse = await this.graphService.getConversationMessages(
            conversation.id, 
            pageAccessToken, 
            limit,
            since ? since.toISOString() : undefined
          );
          
          const messagesData = messagesResponse.data || [];
          
          // Save each message
          if (messagesData && Array.isArray(messagesData)) {
            for (const message of messagesData) {
              try {
                // Check if message already exists
                const existingMessage = await this.prisma.facebookMessage.findFirst({
                  where: { facebookMessageId: message.id }
                });                if (!existingMessage) {                  // Create new message record
                  await this.prisma.facebookMessage.create({
                    data: {
                      id: message.id,
                      facebookMessageId: message.id,
                      facebookPageId: pageId,
                      pageId: pageId,
                      conversationId: conversation.id,
                      fromId: message.from.id,
                      fromName: message.from.name,
                      fromEmail: message.from.email || null,
                      message: message.message || '',
                      content: message.message || '',
                      messageType: 'TEXT',
                      type: 'TEXT',                      isFromPage: message.from.id === pageId,                      
                      sentAt: new Date(message.created_time),
                      attachments: message.attachments ? JSON.stringify(message.attachments) : undefined
                    }
                  });
                  
                  count++;
                }
              } catch (error) {
                this.logger.error(`Error processing message ${message.id}: ${error.message}`);
                // Continue with next message
              }
            }
          }
        } catch (error) {
          this.logger.error(`Error processing conversation ${conversation.id}: ${error.message}`);
          // Continue with next conversation
        }
      }
    }
    
    this.logger.log(`Synced ${count} Facebook Messages for page ${pageId}`);
    return { count };
  }
    /**
   * Sync Facebook Comments for a page
   */
  private async syncComments(
    pageId: string, 
    pageAccessToken: string, 
    limit = 100,
    since?: Date
  ): Promise<{ count: number }> {
    this.logger.log(`Syncing Facebook Comments for page ${pageId}`);
    
    // Get posts from Facebook API
    // This is a custom method that needs to be implemented in the graph service
    // For now, we'll use a placeholder implementation
    const posts = await this.getPagePosts(pageId, pageAccessToken, limit, since);
    let count = 0;
    
    // Process each post
    for (const post of posts) {
      try {
        // Get comments for this post
        const commentsResponse = await this.graphService.getPostComments(post.id, pageAccessToken, limit);
        const commentsData = commentsResponse.data || [];
          // Save each comment
        if (commentsData && Array.isArray(commentsData)) {
          for (const commentData of commentsData) {
            try {
              // Cast to extended interface to access the replies
              const comment = commentData as ExtendedFacebookComment;
              
              // Check if comment already exists
              const existingComment = await this.prisma.facebookComment.findFirst({
                where: { facebookCommentId: comment.id }
              });
              
              if (!existingComment) {
                // Create new comment record
                await this.prisma.facebookComment.create({
                  data: {
                    id: comment.id,
                    facebookCommentId: comment.id,
                    facebookPageId: pageId,
                    pageId: pageId,
                    postId: post.id,
                    fromId: comment.from.id,
                    fromName: comment.from.name,
                    message: comment.message || '',
                    content: comment.message || '',
                    createdTime: new Date(comment.created_time),
                    parentId: comment.parent?.id || null,
                    attachmentType: null,
                    attachmentUrl: null,
                    likeCount: comment.like_count || 0
                  }
                });
                  count++;
                
                // Recursively process comment replies
                if (comment.comments && comment.comments.data && comment.comments.data.length > 0) {
                  for (const reply of comment.comments.data) {
                    try {
                      const existingReply = await this.prisma.facebookComment.findFirst({
                        where: { facebookCommentId: reply.id }
                      });
                      
                      if (!existingReply) {
                        await this.prisma.facebookComment.create({
                          data: {
                            id: reply.id,
                            facebookCommentId: reply.id,
                            facebookPageId: pageId,
                            pageId: pageId,
                            postId: post.id,
                            fromId: reply.from.id,
                            fromName: reply.from.name,
                            message: reply.message || '',
                            content: reply.message || '',
                            createdTime: new Date(reply.created_time),
                            parentId: comment.id,
                            likeCount: reply.like_count || 0
                          }
                        });
                        
                        count++;
                      }
                    } catch (error) {
                      this.logger.error(`Error processing reply ${reply.id}: ${error.message}`);
                      // Continue with next reply
                    }
                  }
                }
              }            } catch (error) {
              this.logger.error(`Error processing comment ${commentData.id}: ${error.message}`);
              // Continue with next comment
            }
          }
        }
      } catch (error) {
        this.logger.error(`Error processing post ${post.id}: ${error.message}`);
        // Continue with next post
      }
    }
    
    this.logger.log(`Synced ${count} Facebook Comments for page ${pageId}`);
    return { count };
  }

  /**
   * Get posts for a page
   * This is a custom method that would normally be in the graph service
   */
  private async getPagePosts(
    pageId: string,
    pageAccessToken: string,
    limit = 100,
    since?: Date
  ): Promise<FacebookPost[]> {
    try {
      const params: Record<string, any> = {
        fields: 'id,message,created_time',
        limit
      };

      if (since) {
        params.since = Math.floor(since.getTime() / 1000);
      }

      // Using the get method from the graph service to fetch posts
      const response = await this.graphService.get<FacebookPost[]>(
        `${pageId}/posts`,
        pageAccessToken,
        params
      );

      return response.data || [];
    } catch (error) {
      this.logger.error(`Error getting page posts: ${error.message}`);
      return [];
    }
  }
  
  /**
   * Create an activity log entry for the sync operation
   */
  private async createSyncActivityLog(data: {
    userId: number;
    facebookUserId: string;
    action: string;
    entityType: string;
    details?: any;
    status: string;
    errorMessage?: string;
  }) {
    try {
      await this.prisma.facebookActivityLog.create({
        data: {
          action: data.action,
          entityType: data.entityType,
          facebookUserId: data.facebookUserId,
          systemUserId: data.userId,
          status: data.status,
          errorMessage: data.errorMessage,
          details: data.details || {}
        }
      });
    } catch (error) {
      this.logger.error(`Error creating activity log: ${error.message}`);
      // Don't throw, just log
    }
  }
}
