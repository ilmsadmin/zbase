import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookGraphService, FacebookMessage as GraphMessage } from './facebook-graph.service';
import { FacebookPagesService } from './facebook-pages.service';
import { SendMessageDto, MessageFiltersDto } from '../dto/facebook-message.dto';
import { FacebookMessage, MessageStatus, MessageType } from '@prisma/client';

export interface MessageWithConversation extends FacebookMessage {
  participants?: Array<{
    name: string;
    id: string;
    email?: string;
  }>;
}

export interface ConversationSummary {
  id: string;
  participants: Array<{
    name: string;
    id: string;
    email?: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    from: string;
    createdAt: Date;
  };
  messageCount: number;
  unreadCount: number;
  updatedAt: Date;
}

@Injectable()
export class FacebookMessagesService {
  private readonly logger = new Logger(FacebookMessagesService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly facebookGraphService: FacebookGraphService,
    private readonly facebookPagesService: FacebookPagesService,
  ) {}

  /**
   * Get conversations for a page
   */
  async getPageConversations(
    userId: number,
    pageId: string,
    limit: number = 10,
    after?: string,
  ): Promise<{ conversations: ConversationSummary[]; nextCursor?: string }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Get conversations from Facebook API
      const response = await this.facebookGraphService.getPageConversations(
        page.facebookPageId,
        pageAccessToken,
        limit,
        after,
      );

      if (!response.data) {
        return { conversations: [] };
      }

      // Process conversations and get local message counts
      const conversations = await Promise.all(
        response.data.map(async (conv: any) => {
          // Get messages count from database
          const messageCount = await this.prismaService.facebookMessage.count({
            where: {
              facebookPageId: pageId,
              conversationId: conv.id,
            },
          });

          // Get unread count
          const unreadCount = await this.prismaService.facebookMessage.count({
            where: {
              facebookPageId: pageId,
              conversationId: conv.id,
              status: MessageStatus.UNREAD,
            },
          });

          // Get last message
          const lastMessage = await this.prismaService.facebookMessage.findFirst({
            where: {
              facebookPageId: pageId,
              conversationId: conv.id,
            },
            orderBy: { createdAt: 'desc' },
          });

          return {
            id: conv.id,
            participants: conv.participants?.data || [],
            lastMessage: lastMessage ? {
              id: lastMessage.id,
              content: lastMessage.content || '',
              from: lastMessage.fromName,
              createdAt: lastMessage.createdAt,
            } : undefined,
            messageCount,
            unreadCount,
            updatedAt: new Date(conv.updated_time),
          };
        }),
      );

      return {
        conversations,
        nextCursor: response.paging?.cursors?.after,
      };
    } catch (error) {
      this.logger.error('Error getting page conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages from a conversation
   */
  async getConversationMessages(
    userId: number,
    pageId: string,
    conversationId: string,
    limit: number = 25,
    after?: string,
  ): Promise<{ messages: MessageWithConversation[]; nextCursor?: string }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Get messages from Facebook API
      const response = await this.facebookGraphService.getConversationMessages(
        conversationId,
        pageAccessToken,
        limit,
        after,
      );

      if (!response.data) {
        return { messages: [] };
      }

      // Sync messages to database and return with local data
      const messages = await this.syncMessagesToDatabase(pageId, conversationId, response.data);

      return {
        messages,
        nextCursor: response.paging?.cursors?.after,
      };
    } catch (error) {
      this.logger.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(
    userId: number,
    pageId: string,
    conversationId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<FacebookMessage> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Send message via Facebook API
      const response = await this.facebookGraphService.sendMessage(
        conversationId,
        pageAccessToken,
        sendMessageDto.content,
      );      // Create local message record
      const message = await this.prismaService.facebookMessage.create({
        data: {
          id: response.id, // Use Facebook message ID as primary key
          facebookPageId: pageId,
          facebookMessageId: response.id,
          conversationId,
          message: sendMessageDto.content, // Required field
          content: sendMessageDto.content,
          fromId: page.facebookPageId,
          fromName: page.name,
          type: MessageType.SENT,
          status: MessageStatus.SENT,
          sentAt: new Date(), // Required field
          createdAt: new Date(),
          page: {
            connect: { id: pageId } // Required page relationship
          }
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'MESSAGE_SENT', {
        pageId,
        conversationId,
        messageId: message.id,
        content: sendMessageDto.content.substring(0, 100),
      });

      this.logger.log(`Message sent to conversation ${conversationId} from page ${page.name}`);
      return message;
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(
    userId: number,
    pageId: string,
    messageIds: string[],
  ): Promise<{ updated: number }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Update message status
      const result = await this.prismaService.facebookMessage.updateMany({
        where: {
          id: { in: messageIds },
          facebookPageId: pageId,
        },
        data: {
          status: MessageStatus.READ,
          readAt: new Date(),
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'MESSAGES_READ', {
        pageId,
        messageIds,
        count: result.count,
      });

      return { updated: result.count };
    } catch (error) {
      this.logger.error('Error marking messages as read:', error);
      throw error;
    }
  }

  /**
   * Get messages with filters
   */
  async getMessages(
    userId: number,
    pageId: string,
    filters: MessageFiltersDto,
  ): Promise<{ messages: FacebookMessage[]; total: number }> {
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

      if (filters.conversationId) {
        where.conversationId = filters.conversationId;
      }

      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.type) {
        where.type = filters.type;
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

      // Get messages and total count
      const [messages, total] = await Promise.all([
        this.prismaService.facebookMessage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip: filters.offset || 0,
          take: filters.limit || 25,
        }),
        this.prismaService.facebookMessage.count({ where }),
      ]);

      return { messages, total };
    } catch (error) {
      this.logger.error('Error getting messages with filters:', error);
      throw error;
    }
  }

  /**
   * Get message statistics
   */
  async getMessageStats(
    userId: number,
    pageId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<{
    totalMessages: number;
    sentMessages: number;
    receivedMessages: number;
    unreadMessages: number;
    conversationsCount: number;
  }> {
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
        totalMessages,
        sentMessages,
        receivedMessages,
        unreadMessages,
        conversationsCount,
      ] = await Promise.all([
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, type: MessageType.SENT, ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, type: MessageType.RECEIVED, ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, status: MessageStatus.UNREAD, ...dateFilter },
        }),
        this.prismaService.facebookMessage.groupBy({
          by: ['conversationId'],
          where: { facebookPageId: pageId, ...dateFilter },
        }).then(result => result.length),
      ]);

      return {
        totalMessages,
        sentMessages,
        receivedMessages,
        unreadMessages,
        conversationsCount,
      };
    } catch (error) {
      this.logger.error('Error getting message statistics:', error);
      throw error;
    }
  }

  /**
   * Sync messages from Facebook API to database
   */
  private async syncMessagesToDatabase(
    pageId: string,
    conversationId: string,
    messages: GraphMessage[],
  ): Promise<MessageWithConversation[]> {
    const syncedMessages: MessageWithConversation[] = [];

    for (const msg of messages) {
      try {
        // Check if message already exists
        const existingMessage = await this.prismaService.facebookMessage.findFirst({
          where: {
            facebookPageId: pageId,
            facebookMessageId: msg.id,
          },
        });

        if (existingMessage) {
          syncedMessages.push({
            ...existingMessage,
            conversationId,
          });
          continue;
        }

        // Create new message
        const messageType = msg.from.id === await this.getPageFacebookId(pageId) 
          ? MessageType.SENT 
          : MessageType.RECEIVED;        const newMessage = await this.prismaService.facebookMessage.create({
          data: {
            id: msg.id, // Use Facebook message ID as primary key
            facebookPageId: pageId,
            facebookMessageId: msg.id,
            conversationId,
            message: msg.message || '', // Required field
            content: msg.message || '',
            fromId: msg.from.id,
            fromName: msg.from.name,
            fromEmail: msg.from.email,
            type: messageType,
            status: messageType === MessageType.SENT ? MessageStatus.SENT : MessageStatus.UNREAD,
            attachments: msg.attachments ? msg.attachments.data : undefined, // Fix JSON type
            sentAt: new Date(msg.created_time), // Required field
            createdAt: new Date(msg.created_time),
            page: {
              connect: { id: pageId } // Required page relationship
            }
          },
        });

        syncedMessages.push({
          ...newMessage,
          conversationId,
        });
      } catch (error) {
        this.logger.error(`Error syncing message ${msg.id}:`, error);
      }
    }

    return syncedMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /**
   * Get page Facebook ID
   */
  private async getPageFacebookId(pageId: string): Promise<string> {
    const page = await this.prismaService.facebookPage.findUnique({
      where: { id: pageId },
      select: { facebookPageId: true },
    });
    return page?.facebookPageId || '';
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
          entityType: 'message', // Required field
          createdAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error logging activity:', error);
      // Don't throw error for logging failures
    }
  }

  /**
   * Auto-reply to messages (if enabled)
   */
  async processAutoReply(
    pageId: string,
    conversationId: string,
    receivedMessage: FacebookMessage,
  ): Promise<void> {
    try {
      // Get page settings
      const page = await this.prismaService.facebookPage.findUnique({
        where: { id: pageId },
      });

      if (!page || !page.settings || !(page.settings as any).autoReply) {
        return;
      }

      // Check if we already sent an auto-reply to this conversation recently
      const recentAutoReply = await this.prismaService.facebookMessage.findFirst({
        where: {
          facebookPageId: pageId,
          conversationId,
          type: MessageType.SENT,
          content: { contains: 'Auto-reply:' },
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      if (recentAutoReply) {
        return; // Don't send multiple auto-replies
      }

      // Send auto-reply
      const autoReplyMessage = `Auto-reply: Thank you for your message. We'll get back to you soon!`;
      
      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);
      
      // Send via Facebook API
      await this.facebookGraphService.sendMessage(
        conversationId,
        pageAccessToken,
        autoReplyMessage,
      );      // Create local record
      await this.prismaService.facebookMessage.create({
        data: {
          id: `auto-${Date.now()}`, // Use auto-generated ID as primary key
          facebookPageId: pageId,
          facebookMessageId: `auto-${Date.now()}`,
          conversationId,
          message: autoReplyMessage, // Required field
          content: autoReplyMessage,
          fromId: page.facebookPageId,
          fromName: page.name,
          type: MessageType.SENT,
          status: MessageStatus.SENT,
          sentAt: new Date(), // Required field
          createdAt: new Date(),
          page: {
            connect: { id: pageId } // Required page relationship
          }
        },
      });

      this.logger.log(`Auto-reply sent to conversation ${conversationId}`);
    } catch (error) {
      this.logger.error('Error processing auto-reply:', error);
    }
  }
}
