import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FacebookCommentsService } from '../services/facebook-comments.service';
import {
  ReplyToCommentDto,
  CommentFiltersDto,
  CommentActionDto,
} from '../dto/facebook-comment.dto';

@Controller('facebook/comments')
@UseGuards(JwtAuthGuard)
export class FacebookCommentsController {
  constructor(
    private readonly facebookCommentsService: FacebookCommentsService,
  ) {}

  /**
   * Get Facebook comments with filters
   */
  @Get()
  async getComments(
    @Request() req: any,
    @Query() filters: CommentFiltersDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.getComments(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: result,
        message: 'Facebook comments retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve Facebook comments',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get comments for a specific post
   */
  @Get('posts/:postId')
  async getPostComments(
    @Request() req: any,
    @Param('postId') postId: string,
    @Query('pageId') pageId: string,
    @Query('limit') limit?: string,
    @Query('after') after?: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.getPostComments(
        userId,
        pageId,
        postId,
        limit ? parseInt(limit) : 25,
        after,
      );

      return {
        success: true,
        data: result,
        message: 'Post comments retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve post comments',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Reply to a Facebook comment
   */
  @Post(':commentId/reply')
  async replyToComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Query('pageId') pageId: string,
    @Body() replyDto: ReplyToCommentDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const reply = await this.facebookCommentsService.replyToComment(
        userId,
        pageId,
        commentId,
        replyDto,
      );

      return {
        success: true,
        data: reply,
        message: 'Comment reply sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to send comment reply',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Hide a Facebook comment
   */
  @Put(':commentId/hide')
  async hideComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Query('pageId') pageId: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.hideComment(
        userId,
        pageId,
        commentId,
      );

      return {
        success: true,
        data: result,
        message: 'Comment hidden successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to hide comment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Delete a Facebook comment
   */
  @Delete(':commentId')
  async deleteComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Query('pageId') pageId: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.deleteComment(
        userId,
        pageId,
        commentId,
      );

      return {
        success: true,
        data: result,
        message: 'Comment deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to delete comment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Approve a Facebook comment
   */
  @Put(':commentId/approve')
  async approveComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
    @Query('pageId') pageId: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.approveComment(
        userId,
        pageId,
        commentId,
      );

      return {
        success: true,
        data: result,
        message: 'Comment approved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to approve comment',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Perform bulk actions on comments
   */
  @Post('bulk-action')
  async bulkAction(
    @Request() req: any,
    @Query('pageId') pageId: string,
    @Body('commentIds') commentIds: string[],
    @Body('action') action: CommentActionDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      if (!commentIds || commentIds.length === 0) {
        throw new HttpException('Comment IDs are required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookCommentsService.bulkAction(
        userId,
        pageId,
        commentIds,
        action,
      );

      return {
        success: true,
        data: result,
        message: `Bulk ${action} completed successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to perform bulk action',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get comment statistics
   */
  @Get('stats')
  async getCommentStats(
    @Request() req: any,
    @Query('pageId') pageId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const stats = await this.facebookCommentsService.getCommentStats(
        userId,
        pageId,
        fromDate ? new Date(fromDate) : undefined,
        toDate ? new Date(toDate) : undefined,
      );

      return {
        success: true,
        data: stats,
        message: 'Comment statistics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve comment statistics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
