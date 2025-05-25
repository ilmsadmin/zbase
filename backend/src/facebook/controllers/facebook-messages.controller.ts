import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/permissions.decorator';
import { FacebookMessagesService } from '../services/facebook-messages.service';
import {
  SendMessageDto,
  MessageFiltersDto,
  BulkActionDto,
} from '../dto/facebook-message.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Facebook Messages')
@ApiBearerAuth()
@Controller('facebook/messages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FacebookMessagesController {
  constructor(
    private readonly facebookMessagesService: FacebookMessagesService,
  ) {}
  /**
   * Get conversations for a page
   */
  @Get('conversations')
  @RequirePermissions('facebook.messages.read')
  @ApiOperation({ summary: 'Get conversations for a page' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPageConversations(
    @Request() req: any,
    @Query('pageId') pageId: string,
    @Query('limit') limit?: string,
    @Query('after') after?: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookMessagesService.getPageConversations(
        userId,
        pageId,
        limit ? parseInt(limit) : 10,
        after,
      );

      return {
        success: true,
        data: result,
        message: 'Page conversations retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve page conversations',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get messages from a conversation
   */
  @Get('conversations/:conversationId/messages')
  @RequirePermissions('facebook.messages.read')
  @ApiOperation({ summary: 'Get messages from a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getConversationMessages(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Query('pageId') pageId: string,
    @Query('limit') limit?: string,
    @Query('after') after?: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookMessagesService.getConversationMessages(
        userId,
        pageId,
        conversationId,
        limit ? parseInt(limit) : 25,
        after,
      );

      return {
        success: true,
        data: result,
        message: 'Conversation messages retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve conversation messages',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Send a message to a conversation
   */
  @Post('conversations/:conversationId/send')
  @RequirePermissions('facebook.messages.send')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async sendMessage(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
    @Query('pageId') pageId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const message = await this.facebookMessagesService.sendMessage(
        userId,
        pageId,
        conversationId,
        sendMessageDto,
      );

      return {
        success: true,
        data: message,
        message: 'Message sent successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to send message',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Mark messages as read
   */
  @Put('mark-read')
  @RequirePermissions('facebook.messages.reply')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiResponse({ status: 200, description: 'Messages marked as read successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async markAsRead(
    @Request() req: any,
    @Query('pageId') pageId: string,
    @Body('messageIds') messageIds: string[],
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      if (!messageIds || messageIds.length === 0) {
        throw new HttpException('Message IDs are required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookMessagesService.markAsRead(
        userId,
        pageId,
        messageIds,
      );

      return {
        success: true,
        data: result,
        message: 'Messages marked as read successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to mark messages as read',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * Get messages with filters
   */
  @Get()
  @RequirePermissions('facebook.messages.read')
  @ApiOperation({ summary: 'Get messages with filters' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMessages(
    @Request() req: any,
    @Query() filters: MessageFiltersDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.facebookMessagesService.getMessages(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: result,
        message: 'Messages retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve messages',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get message statistics
   */
  @Get('stats')
  async getMessageStats(
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

      const stats = await this.facebookMessagesService.getMessageStats(
        userId,
        pageId,
        fromDate ? new Date(fromDate) : undefined,
        toDate ? new Date(toDate) : undefined,
      );

      return {
        success: true,
        data: stats,
        message: 'Message statistics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve message statistics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Perform bulk actions on messages
   */
  @Post('bulk-action')
  async bulkAction(
    @Request() req: any,
    @Query('pageId') pageId: string,
    @Body() bulkActionDto: BulkActionDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      if (!bulkActionDto.messageIds || bulkActionDto.messageIds.length === 0) {
        throw new HttpException('Message IDs are required', HttpStatus.BAD_REQUEST);
      }

      let result;
      
      switch (bulkActionDto.action) {
        case 'markRead':
          result = await this.facebookMessagesService.markAsRead(
            userId,
            pageId,
            bulkActionDto.messageIds,
          );
          break;
        default:
          throw new HttpException(
            `Action '${bulkActionDto.action}' is not supported`,
            HttpStatus.BAD_REQUEST,
          );
      }

      return {
        success: true,
        data: result,
        message: `Bulk ${bulkActionDto.action} completed successfully`,
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
}