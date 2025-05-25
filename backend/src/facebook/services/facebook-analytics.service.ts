import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookGraphService } from './facebook-graph.service';
import { FacebookPagesService } from './facebook-pages.service';
import { AnalyticsFiltersDto } from '../dto/facebook-analytics.dto';

export interface PageInsights {
  pageId: string;
  pageName: string;
  fans: number;
  impressions: number;
  engagedUsers: number;
  reach: number;
  period: string;
  date: Date;
}

export interface MessageAnalytics {
  totalMessages: number;
  sentMessages: number;
  receivedMessages: number;
  unreadMessages: number;
  conversationsCount: number;
  averageResponseTime: number; // in minutes
  responseRate: number; // percentage
}

export interface CommentAnalytics {
  totalComments: number;
  repliedComments: number;
  hiddenComments: number;
  deletedComments: number;
  averageResponseTime: number; // in minutes
  responseRate: number; // percentage
  sentimentScore?: number; // -1 to 1
}

export interface ActivitySummary {
  date: Date;
  messagesReceived: number;
  messagesSent: number;
  commentsReceived: number;
  commentsReplied: number;
  newFollowers: number;
  pageViews: number;
  engagement: number;
}

export interface OverallAnalytics {
  period: {
    from: Date;
    to: Date;
  };
  messages: MessageAnalytics;
  comments: CommentAnalytics;
  pageInsights: PageInsights[];
  activitySummary: ActivitySummary[];
  topPosts?: Array<{
    postId: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  }>;
}

@Injectable()
export class FacebookAnalyticsService {
  private readonly logger = new Logger(FacebookAnalyticsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly facebookGraphService: FacebookGraphService,
    private readonly facebookPagesService: FacebookPagesService,
  ) {}

  /**
   * Get overall analytics for a page
   */
  async getPageAnalytics(
    userId: number,
    pageId: string,
    filters: AnalyticsFiltersDto,
  ): Promise<OverallAnalytics> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);

      // Get analytics data in parallel
      const [messages, comments, pageInsights, activitySummary] = await Promise.all([
        this.getMessageAnalytics(pageId, fromDate, toDate),
        this.getCommentAnalytics(pageId, fromDate, toDate),
        this.getPageInsights(userId, pageId, fromDate, toDate, filters.period || 'day'),
        this.getActivitySummary(pageId, fromDate, toDate),
      ]);

      return {
        period: { from: fromDate, to: toDate },
        messages,
        comments,
        pageInsights,
        activitySummary,
      };
    } catch (error) {
      this.logger.error('Error getting page analytics:', error);
      throw error;
    }
  }

  /**
   * Get message analytics
   */
  async getMessageAnalytics(
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<MessageAnalytics> {
    try {
      const dateFilter = {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      };

      // Get message counts
      const [
        totalMessages,
        sentMessages,
        receivedMessages,
        unreadMessages,
        conversations,
        responseTimeData,
      ] = await Promise.all([
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, type: 'SENT', ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, type: 'RECEIVED', ...dateFilter },
        }),
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, status: 'UNREAD' },
        }),
        this.prismaService.facebookMessage.groupBy({
          by: ['conversationId'],
          where: { facebookPageId: pageId, ...dateFilter },
        }),
        this.calculateAverageResponseTime(pageId, fromDate, toDate),
      ]);

      const conversationsCount = conversations.length;
      const responseRate = receivedMessages > 0 ? (sentMessages / receivedMessages) * 100 : 0;

      return {
        totalMessages,
        sentMessages,
        receivedMessages,
        unreadMessages,
        conversationsCount,
        averageResponseTime: responseTimeData.averageMinutes,
        responseRate: Math.min(responseRate, 100), // Cap at 100%
      };
    } catch (error) {
      this.logger.error('Error getting message analytics:', error);
      throw error;
    }
  }

  /**
   * Get comment analytics
   */
  async getCommentAnalytics(
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<CommentAnalytics> {
    try {
      const dateFilter = {
        createdAt: {
          gte: fromDate,
          lte: toDate,
        },
      };

      // Get comment counts
      const [
        totalComments,
        repliedComments,
        hiddenComments,
        deletedComments,
        responseTimeData,
      ] = await Promise.all([
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, hasReply: true, ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, status: 'HIDDEN', ...dateFilter },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, status: 'DELETED', ...dateFilter },
        }),
        this.calculateCommentResponseTime(pageId, fromDate, toDate),
      ]);      return {
        totalComments,
        repliedComments,
        hiddenComments,
        deletedComments,
        averageResponseTime: responseTimeData.averageMinutes,
        responseRate: totalComments > 0 ? (repliedComments / totalComments) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Error getting comment analytics:', error);
      throw error;
    }
  }

  /**
   * Get page insights from Facebook API
   */
  async getPageInsights(
    userId: number,
    pageId: string,
    fromDate: Date,
    toDate: Date,
    period: 'day' | 'week' | 'days_28',
  ): Promise<PageInsights[]> {
    try {
      // Get page info
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const pageAccessToken = await this.facebookPagesService.getPageAccessToken(pageId);

      // Get insights from Facebook API
      const metrics = [
        'page_fans',
        'page_impressions',
        'page_engaged_users',
        'page_post_engagements',
        'page_views_total',
      ];

      const response = await this.facebookGraphService.getPageInsights(
        page.facebookPageId,
        pageAccessToken,
        metrics,
        period,
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0],
      );

      if (!response.data) {
        return [];
      }

      // Process insights data
      const insightsMap = new Map();
      
      response.data.forEach((insight: any) => {
        insight.values.forEach((value: any) => {
          const date = new Date(value.end_time);
          const dateKey = date.toDateString();
          
          if (!insightsMap.has(dateKey)) {
            insightsMap.set(dateKey, {
              pageId,
              pageName: page.name,
              date,
              period,
              fans: 0,
              impressions: 0,
              engagedUsers: 0,
              reach: 0,
            });
          }

          const dayInsights = insightsMap.get(dateKey);
          
          switch (insight.name) {
            case 'page_fans':
              dayInsights.fans = value.value || 0;
              break;
            case 'page_impressions':
              dayInsights.impressions = value.value || 0;
              break;
            case 'page_engaged_users':
              dayInsights.engagedUsers = value.value || 0;
              break;
            case 'page_post_engagements':
              dayInsights.engagement = value.value || 0;
              break;
          }
        });
      });

      return Array.from(insightsMap.values()).sort((a, b) => 
        a.date.getTime() - b.date.getTime()
      );
    } catch (error) {
      this.logger.error('Error getting page insights:', error);
      // Return empty array if insights fail
      return [];
    }
  }

  /**
   * Get activity summary by day
   */
  async getActivitySummary(
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<ActivitySummary[]> {
    try {
      // Generate date range
      const dates = this.generateDateRange(fromDate, toDate);
      
      const summaries = await Promise.all(
        dates.map(async (date) => {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          const [
            messagesReceived,
            messagesSent,
            commentsReceived,
            commentsReplied,
          ] = await Promise.all([
            this.prismaService.facebookMessage.count({
              where: {
                facebookPageId: pageId,
                type: 'RECEIVED',
                createdAt: { gte: startOfDay, lte: endOfDay },
              },
            }),
            this.prismaService.facebookMessage.count({
              where: {
                facebookPageId: pageId,
                type: 'SENT',
                createdAt: { gte: startOfDay, lte: endOfDay },
              },
            }),
            this.prismaService.facebookComment.count({
              where: {
                facebookPageId: pageId,
                type: 'COMMENT',
                createdAt: { gte: startOfDay, lte: endOfDay },
              },
            }),
            this.prismaService.facebookComment.count({
              where: {
                facebookPageId: pageId,
                type: 'REPLY',
                createdAt: { gte: startOfDay, lte: endOfDay },
              },
            }),
          ]);

          return {
            date,
            messagesReceived,
            messagesSent,
            commentsReceived,
            commentsReplied,
            newFollowers: 0, // Would need to be calculated from insights
            pageViews: 0, // Would need to be calculated from insights
            engagement: commentsReceived + messagesReceived,
          };
        }),
      );

      return summaries;
    } catch (error) {
      this.logger.error('Error getting activity summary:', error);
      throw error;
    }
  }

  /**
   * Get response time trends
   */
  async getResponseTimeTrends(
    userId: number,
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<Array<{ date: Date; averageResponseTime: number }>> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      const dates = this.generateDateRange(fromDate, toDate);
      
      const trends = await Promise.all(
        dates.map(async (date) => {
          const startOfDay = new Date(date);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date);
          endOfDay.setHours(23, 59, 59, 999);

          const responseTimeData = await this.calculateAverageResponseTime(
            pageId,
            startOfDay,
            endOfDay,
          );

          return {
            date,
            averageResponseTime: responseTimeData.averageMinutes,
          };
        }),
      );

      return trends;
    } catch (error) {
      this.logger.error('Error getting response time trends:', error);
      throw error;
    }
  }

  /**
   * Export analytics data
   */
  async exportAnalytics(
    userId: number,
    pageId: string,
    filters: AnalyticsFiltersDto,
    format: 'csv' | 'json' = 'json',
  ): Promise<string> {
    try {
      const analytics = await this.getPageAnalytics(userId, pageId, filters);
      
      if (format === 'json') {
        return JSON.stringify(analytics, null, 2);
      }

      // Convert to CSV format
      const csvLines = [
        'Date,Messages Received,Messages Sent,Comments Received,Comments Replied,Engagement',
      ];

      analytics.activitySummary.forEach((summary) => {
        csvLines.push(
          `${summary.date.toISOString().split('T')[0]},${summary.messagesReceived},${summary.messagesSent},${summary.commentsReceived},${summary.commentsReplied},${summary.engagement}`,
        );
      });

      return csvLines.join('\n');
    } catch (error) {
      this.logger.error('Error exporting analytics:', error);
      throw error;
    }
  }

  /**
   * Calculate average response time for messages
   */
  private async calculateAverageResponseTime(
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<{ averageMinutes: number; totalResponses: number }> {
    try {
      // Get conversations with both received and sent messages
      const conversations = await this.prismaService.facebookMessage.groupBy({
        by: ['conversationId'],
        where: {
          facebookPageId: pageId,
          createdAt: { gte: fromDate, lte: toDate },
        },
      });

      let totalResponseTime = 0;
      let totalResponses = 0;

      for (const conv of conversations) {
        // Get messages in this conversation, ordered by time
        const messages = await this.prismaService.facebookMessage.findMany({
          where: {
            facebookPageId: pageId,
            conversationId: conv.conversationId,
            createdAt: { gte: fromDate, lte: toDate },
          },
          orderBy: { createdAt: 'asc' },
        });

        // Calculate response times
        for (let i = 0; i < messages.length - 1; i++) {
          const currentMessage = messages[i];
          const nextMessage = messages[i + 1];

          // If current is received and next is sent, it's a response
          if (currentMessage.type === 'RECEIVED' && nextMessage.type === 'SENT') {
            const responseTime = nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime();
            const responseMinutes = responseTime / (1000 * 60); // Convert to minutes
            
            totalResponseTime += responseMinutes;
            totalResponses++;
          }
        }
      }

      const averageMinutes = totalResponses > 0 ? totalResponseTime / totalResponses : 0;

      return { averageMinutes, totalResponses };
    } catch (error) {
      this.logger.error('Error calculating response time:', error);
      return { averageMinutes: 0, totalResponses: 0 };
    }
  }

  /**
   * Calculate average response time for comments
   */
  private async calculateCommentResponseTime(
    pageId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<{ averageMinutes: number; totalResponses: number }> {
    try {
      // Get comments that have replies
      const comments = await this.prismaService.facebookComment.findMany({
        where: {
          facebookPageId: pageId,
          hasReply: true,
          createdAt: { gte: fromDate, lte: toDate },
        },
      });

      let totalResponseTime = 0;
      let totalResponses = 0;

      for (const comment of comments) {
        // Get the first reply to this comment
        const reply = await this.prismaService.facebookComment.findFirst({
          where: {
            facebookPageId: pageId,
            parentCommentId: comment.id,
            type: 'REPLY',
          },
          orderBy: { createdAt: 'asc' },
        });

        if (reply) {
          const responseTime = reply.createdAt.getTime() - comment.createdAt.getTime();
          const responseMinutes = responseTime / (1000 * 60);
          
          totalResponseTime += responseMinutes;
          totalResponses++;
        }
      }

      const averageMinutes = totalResponses > 0 ? totalResponseTime / totalResponses : 0;

      return { averageMinutes, totalResponses };
    } catch (error) {
      this.logger.error('Error calculating comment response time:', error);
      return { averageMinutes: 0, totalResponses: 0 };
    }
  }

  /**
   * Generate date range
   */
  private generateDateRange(fromDate: Date, toDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(fromDate);

    while (currentDate <= toDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics(userId: number, pageId: string): Promise<{
    unreadMessages: number;
    pendingComments: number;
    todayMessages: number;
    todayComments: number;
    avgResponseTime: number;
  }> {
    try {
      // Verify user owns the page
      const page = await this.facebookPagesService.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        unreadMessages,
        pendingComments,
        todayMessages,
        todayComments,
        responseTimeData,
      ] = await Promise.all([
        this.prismaService.facebookMessage.count({
          where: { facebookPageId: pageId, status: 'UNREAD' },
        }),
        this.prismaService.facebookComment.count({
          where: { facebookPageId: pageId, status: 'PENDING' },
        }),
        this.prismaService.facebookMessage.count({
          where: {
            facebookPageId: pageId,
            createdAt: { gte: today, lt: tomorrow },
          },
        }),
        this.prismaService.facebookComment.count({
          where: {
            facebookPageId: pageId,
            createdAt: { gte: today, lt: tomorrow },
          },
        }),
        this.calculateAverageResponseTime(pageId, today, new Date()),
      ]);

      return {
        unreadMessages,
        pendingComments,
        todayMessages,
        todayComments,
        avgResponseTime: responseTimeData.averageMinutes,
      };
    } catch (error) {
      this.logger.error('Error getting real-time metrics:', error);
      throw error;
    }
  }
  async getOverview(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      const [messageAnalytics, commentAnalytics, pageInsights] = await Promise.all([
        this.getMessageAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate)),
        this.getCommentAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate)),
        this.getPageInsights(userId, pageId, new Date(filters.fromDate), new Date(filters.toDate), filters.period || 'day'),
      ]);

      return {
        messageAnalytics,
        commentAnalytics,
        pageInsights,
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting analytics overview:', error);
      throw error;
    }
  }

  async getEngagementMetrics(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      const commentAnalytics = await this.getCommentAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate));
      const messageAnalytics = await this.getMessageAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate));

      return {
        engagementRate: commentAnalytics.responseRate,
        responseTime: messageAnalytics.averageResponseTime,
        totalEngagements: commentAnalytics.totalComments + messageAnalytics.totalMessages,
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting engagement metrics:', error);
      throw error;
    }
  }
  async getResponseTimeAnalytics(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      const responseTime = await this.calculateAverageResponseTime(pageId, new Date(filters.fromDate), new Date(filters.toDate));
      return {
        averageResponseTime: responseTime.averageMinutes,
        totalConversations: responseTime.totalResponses,
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting response time analytics:', error);
      throw error;
    }
  }

  async getTopPerformers(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      // This is a placeholder implementation
      // In a real implementation, you would analyze comments, messages, and engagement
      return {
        topPosts: [],
        topComments: [],
        topMessages: [],
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting top performers:', error);
      throw error;
    }
  }

  async getActivityTrends(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      const messageAnalytics = await this.getMessageAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate));
      const commentAnalytics = await this.getCommentAnalytics(pageId, new Date(filters.fromDate), new Date(filters.toDate));

      return {
        messageTrends: {
          total: messageAnalytics.totalMessages,
          sent: messageAnalytics.sentMessages,
          received: messageAnalytics.receivedMessages,
        },
        commentTrends: {
          total: commentAnalytics.totalComments,
          replied: commentAnalytics.repliedComments,
          hidden: commentAnalytics.hiddenComments,
        },
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting activity trends:', error);
      throw error;
    }
  }  async getAudienceInsights(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      // Placeholder implementation
      // In a real implementation, you would analyze audience demographics and behavior
      return {
        demographics: {
          ageGroups: [],
          genderDistribution: {},
          locationData: [],
        },
        engagement: {
          peakHours: [],
          activedays: [],
        },
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting audience insights:', error);
      throw error;
    }
  }

  async comparePerformance(userId: number, pageId: string, filters: any): Promise<any> {
    try {
      // Placeholder implementation for performance comparison
      return {
        currentPeriod: {},
        comparisonPeriod: {},
        improvement: {},
      };
    } catch (error) {
      this.logger.error('Error comparing performance:', error);
      throw error;
    }
  }

  async getCustomMetrics(userId: number, pageId: string, filters: AnalyticsFiltersDto): Promise<any> {
    try {
      // Placeholder implementation for custom metrics
      return {
        customMetrics: [],
        period: {
          from: filters.fromDate,
          to: filters.toDate,
        },
      };
    } catch (error) {
      this.logger.error('Error getting custom metrics:', error);
      throw error;
    }
  }
}
