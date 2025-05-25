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
import { FacebookMessagesService } from '../services/facebook-messages.service';
import {
  SendMessageDto,
  MessageFiltersDto,
  BulkActionDto,
} from '../dto/facebook-message.dto';

@Controller('facebook/messages')
@UseGuards(JwtAuthGuard)
export class FacebookMessagesController {
  constructor(
    private readonly facebookMessagesService: FacebookMessagesService,
  ) {}

  /**
   * Get conversations for a page
   */
  @Get('conversations')
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