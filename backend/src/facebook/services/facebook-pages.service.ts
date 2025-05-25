import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookGraphService, FacebookPageInfo } from './facebook-graph.service';
import { FacebookAuthService } from './facebook-auth.service';
import { ConnectPageDto, UpdatePageDto } from '../dto/facebook-page.dto';
import { FacebookPage, FacebookUser } from '@prisma/client';

export interface PageWithStats extends FacebookPage {
  messageCount?: number;
  commentCount?: number;
  lastActivity?: Date;
}

@Injectable()
export class FacebookPagesService {
  private readonly logger = new Logger(FacebookPagesService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly facebookGraphService: FacebookGraphService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {}

  /**
   * Get all connected pages for a user
   */
  async getUserPages(userId: number): Promise<PageWithStats[]> {
    try {
      // Get user's Facebook connection
      const facebookUser = await this.prismaService.facebookUser.findFirst({
        where: { userId },
        include: {
          pages: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!facebookUser) {
        return [];
      }

      // Get stats for each page
      const pagesWithStats = await Promise.all(
        facebookUser.pages.map(async (page) => {
          const stats = await this.getPageStats(page.id);
          return {
            ...page,
            ...stats,
          };
        }),
      );

      return pagesWithStats;
    } catch (error) {
      this.logger.error('Error getting user pages:', error);
      throw error;
    }
  }

  /**
   * Get available pages from Facebook (not yet connected)
   */
  async getAvailablePages(userId: number): Promise<FacebookPageInfo[]> {
    try {
      // Get user's Facebook connection
      const facebookUser = await this.prismaService.facebookUser.findFirst({
        where: { userId },
        include: { pages: true },
      });

      if (!facebookUser) {
        throw new BadRequestException('Facebook account not connected');
      }

      // Get pages from Facebook API
      const facebookPages = await this.facebookGraphService.getUserPages(facebookUser.id);

      // Filter out already connected pages
      const connectedPageIds = facebookUser.pages.map(page => page.facebookPageId);
      const availablePages = facebookPages.filter(
        page => !connectedPageIds.includes(page.id),
      );

      return availablePages;
    } catch (error) {
      this.logger.error('Error getting available pages:', error);
      throw error;
    }
  }

  /**
   * Connect a Facebook page
   */
  async connectPage(userId: number, connectPageDto: ConnectPageDto): Promise<FacebookPage> {
    try {
      // Get user's Facebook connection
      const facebookUser = await this.prismaService.facebookUser.findFirst({
        where: { userId },
      });

      if (!facebookUser) {
        throw new BadRequestException('Facebook account not connected');
      }

      // Get page info from Facebook API
      const facebookPages = await this.facebookGraphService.getUserPages(facebookUser.id);
      const pageInfo = facebookPages.find(page => page.id === connectPageDto.facebookPageId);

      if (!pageInfo) {
        throw new BadRequestException('Page not found or access denied');
      }

      // Check if page is already connected
      const existingPage = await this.prismaService.facebookPage.findFirst({
        where: {
          facebookUserId: facebookUser.id,
          facebookPageId: connectPageDto.facebookPageId,
        },
      });

      if (existingPage) {
        throw new BadRequestException('Page is already connected');
      }

      // Encrypt page access token
      const encryptedAccessToken = await this.facebookAuthService.encryptToken(pageInfo.access_token);      // Create page record
      const page = await this.prismaService.facebookPage.create({
        data: {
          id: pageInfo.id, // Use Facebook Page ID as the primary key
          facebookUserId: facebookUser.id,
          facebookPageId: pageInfo.id,
          name: pageInfo.name,
          category: pageInfo.category,
          accessToken: encryptedAccessToken,
          pictureUrl: pageInfo.picture?.data?.url,
          fanCount: pageInfo.fan_count || 0,
          about: pageInfo.about,
          website: pageInfo.website,
          phone: pageInfo.phone,
          email: pageInfo.email,
          isActive: true,
          settings: {
            autoReply: connectPageDto.settings?.autoReply || false,
            notifications: connectPageDto.settings?.notifications || true,
            moderateComments: connectPageDto.settings?.moderateComments || false,
          },
        },
      });

      // Log activity
      await this.logActivity(facebookUser.id, 'PAGE_CONNECTED', {
        pageId: page.id,
        pageName: page.name,
        facebookPageId: page.facebookPageId,
      });

      this.logger.log(`Page connected: ${page.name} (${page.facebookPageId})`);
      return page;
    } catch (error) {
      this.logger.error('Error connecting page:', error);
      throw error;
    }
  }

  /**
   * Disconnect a Facebook page
   */
  async disconnectPage(userId: number, pageId: string): Promise<void> {
    try {
      // Find the page
      const page = await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
        include: { facebookUser: true },
      });

      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Delete related data
      await this.prismaService.$transaction(async (tx) => {
        // Delete comments
        await tx.facebookComment.deleteMany({
          where: { facebookPageId: pageId },
        });

        // Delete messages
        await tx.facebookMessage.deleteMany({
          where: { facebookPageId: pageId },
        });

        // Delete page
        await tx.facebookPage.delete({
          where: { id: pageId },
        });
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'PAGE_DISCONNECTED', {
        pageId: pageId,
        pageName: page.name,
        facebookPageId: page.facebookPageId,
      });

      this.logger.log(`Page disconnected: ${page.name} (${page.facebookPageId})`);
    } catch (error) {
      this.logger.error('Error disconnecting page:', error);
      throw error;
    }
  }

  /**
   * Update page settings
   */
  async updatePageSettings(userId: number, pageId: string, updatePageDto: UpdatePageDto): Promise<FacebookPage> {
    try {
      // Find the page
      const page = await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
      });

      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Update page
      const updatedPage = await this.prismaService.facebookPage.update({
        where: { id: pageId },
        data: {
          isActive: updatePageDto.isActive ?? page.isActive,
          settings: {
            ...page.settings as any,
            ...updatePageDto.settings,
          },
          updatedAt: new Date(),
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'PAGE_SETTINGS_UPDATED', {
        pageId: pageId,
        pageName: page.name,
        changes: updatePageDto,
      });

      this.logger.log(`Page settings updated: ${page.name} (${page.facebookPageId})`);
      return updatedPage;
    } catch (error) {
      this.logger.error('Error updating page settings:', error);
      throw error;
    }
  }

  /**
   * Refresh page information from Facebook
   */
  async refreshPageInfo(userId: number, pageId: string): Promise<FacebookPage> {
    try {
      // Find the page
      const page = await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
        include: { facebookUser: true },
      });

      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get fresh page info from Facebook
      const facebookPages = await this.facebookGraphService.getUserPages(page.facebookUserId);
      const pageInfo = facebookPages.find(p => p.id === page.facebookPageId);

      if (!pageInfo) {
        // Page might have been deleted or access revoked
        await this.prismaService.facebookPage.update({
          where: { id: pageId },
          data: { isActive: false },
        });
        throw new BadRequestException('Page no longer accessible');
      }

      // Update page information
      const updatedPage = await this.prismaService.facebookPage.update({
        where: { id: pageId },
        data: {
          name: pageInfo.name,
          category: pageInfo.category,
          pictureUrl: pageInfo.picture?.data?.url,
          fanCount: pageInfo.fan_count || 0,
          about: pageInfo.about,
          website: pageInfo.website,
          phone: pageInfo.phone,
          email: pageInfo.email,
          updatedAt: new Date(),
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'PAGE_REFRESHED', {
        pageId: pageId,
        pageName: page.name,
      });

      this.logger.log(`Page info refreshed: ${page.name} (${page.facebookPageId})`);
      return updatedPage;
    } catch (error) {
      this.logger.error('Error refreshing page info:', error);
      throw error;
    }
  }

  /**
   * Get page by ID
   */
  async getPageById(userId: number, pageId: string): Promise<FacebookPage | null> {
    try {
      return await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
      });
    } catch (error) {
      this.logger.error('Error getting page by ID:', error);
      throw error;
    }
  }

  /**
   * Find a specific page for a user
   */
  async findUserPage(userId: number, pageId: string): Promise<FacebookPage | null> {
    try {
      return await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
      });
    } catch (error) {
      this.logger.error('Error finding user page:', error);
      throw error;
    }
  }

  /**
   * Update a Facebook page
   */
  async updatePage(userId: number, pageId: string, updatePageDto: UpdatePageDto): Promise<FacebookPage> {
    return this.updatePageSettings(userId, pageId, updatePageDto);
  }

  /**
   * Sync page data from Facebook
   */
  async syncPage(userId: number, pageId: string): Promise<FacebookPage> {
    return this.refreshPageInfo(userId, pageId);
  }

  /**
   * Get page insights
   */  async getPageInsights(
    pageId: string, 
    userId: number, 
    metric?: string, 
    period?: 'day' | 'week' | 'days_28'
  ): Promise<any> {
    try {
      // Find the page
      const page = await this.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const accessToken = await this.getPageAccessToken(pageId);
        // Get insights from Facebook API
      const insights = await this.facebookGraphService.getPageInsights(
        page.facebookPageId,
        accessToken,
        metric ? [metric] : undefined,
        period
      );

      return insights;
    } catch (error) {
      this.logger.error('Error getting page insights:', error);
      throw error;
    }
  }

  /**
   * Refresh page access token
   */
  async refreshPageToken(userId: number, pageId: string): Promise<any> {
    try {
      // Find the page
      const page = await this.prismaService.facebookPage.findFirst({
        where: {
          id: pageId,
          facebookUser: { userId },
        },
        include: { facebookUser: true },
      });

      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get fresh page info and token from Facebook
      const facebookPages = await this.facebookGraphService.getUserPages(page.facebookUserId);
      const pageInfo = facebookPages.find(p => p.id === page.facebookPageId);

      if (!pageInfo) {
        throw new BadRequestException('Page no longer accessible');
      }

      // Encrypt new access token
      const encryptedAccessToken = await this.facebookAuthService.encryptToken(pageInfo.access_token);

      // Update page with new token
      const updatedPage = await this.prismaService.facebookPage.update({
        where: { id: pageId },
        data: {
          accessToken: encryptedAccessToken,
          updatedAt: new Date(),
        },
      });

      // Log activity
      await this.logActivity(page.facebookUserId, 'PAGE_TOKEN_REFRESHED', {
        pageId: pageId,
        pageName: page.name,
      });

      this.logger.log(`Page token refreshed: ${page.name} (${page.facebookPageId})`);
      return { success: true, message: 'Token refreshed successfully' };
    } catch (error) {
      this.logger.error('Error refreshing page token:', error);
      throw error;
    }
  }

  /**
   * Check page connection health
   */
  async checkPageHealth(userId: number, pageId: string): Promise<any> {
    try {
      // Find the page
      const page = await this.getPageById(userId, pageId);
      if (!page) {
        throw new NotFoundException('Page not found');
      }

      // Get page access token
      const accessToken = await this.getPageAccessToken(pageId);
        // Validate token with Facebook API
      const isValid = await this.facebookGraphService.validateAccessToken(accessToken);      // Get basic page info to check connectivity
      let pageInfo: FacebookPageInfo | null = null;
      if (isValid) {
        try {
          // Just check if we can access basic page data
          const facebookPages = await this.facebookGraphService.getUserPages(page.facebookUserId);
          pageInfo = facebookPages.find(p => p.id === page.facebookPageId) || null;
        } catch (error) {
          this.logger.warn(`Failed to get page info for health check: ${error.message}`);
        }
      }const health = {
        pageId,
        pageName: page.name,
        isConnected: isValid && !!pageInfo,
        tokenValid: isValid,
        lastSyncAt: page.lastSyncAt,
        isActive: page.isActive,
        checkTime: new Date(),
        status: isValid && pageInfo ? 'healthy' : 'unhealthy',
        issues: [] as string[]
      };

      if (!isValid) {
        health.issues.push('Invalid or expired access token');
      }
      if (!pageInfo && isValid) {
        health.issues.push('Cannot fetch page information');
      }
      if (!page.isActive) {
        health.issues.push('Page is deactivated');
      }

      return health;
    } catch (error) {
      this.logger.error('Error checking page health:', error);
      throw error;
    }
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
          entityType: 'page', // Required field for Facebook activity logs
          details,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error('Error logging activity:', error);
      // Don't throw error for logging failures
    }
  }

  /**
   * Get decrypted page access token
   */
  async getPageAccessToken(pageId: string): Promise<string> {
    try {
      const page = await this.prismaService.facebookPage.findUnique({
        where: { id: pageId },
        select: { accessToken: true },
      });

      if (!page) {
        throw new NotFoundException('Page not found');
      }

      return await this.facebookAuthService.decryptToken(page.accessToken);
    } catch (error) {
      this.logger.error('Error getting page access token:', error);
      throw error;
    }
  }

  /**
   * Validate page access tokens
   */
  async validatePageTokens(userId: number): Promise<{ valid: number; invalid: number }> {
    try {
      const pages = await this.getUserPages(userId);
      let valid = 0;
      let invalid = 0;

      for (const page of pages) {
        try {
          const accessToken = await this.getPageAccessToken(page.id);
          const isValid = await this.facebookGraphService.validateAccessToken(accessToken);
          
          if (isValid) {
            valid++;
          } else {
            invalid++;
            // Deactivate invalid page
            await this.prismaService.facebookPage.update({
              where: { id: page.id },
              data: { isActive: false },
            });
          }
        } catch (error) {
          invalid++;
          this.logger.warn(`Failed to validate token for page ${page.id}:`, error);
        }
      }

      return { valid, invalid };
    } catch (error) {
      this.logger.error('Error validating page tokens:', error);
      throw error;
    }
  }

  /**
   * Get page statistics
   */
  async getPageStats(pageId: string): Promise<{
    messageCount: number;
    commentCount: number;
    lastActivity?: Date;
  }> {
    try {
      // Get message count for the page
      const messageCount = await this.prismaService.facebookMessage.count({
        where: { facebookPageId: pageId },
      });

      // Get comment count for the page
      const commentCount = await this.prismaService.facebookComment.count({
        where: { pageId: pageId },
      });

      // Get last activity (most recent message or comment)
      const lastMessage = await this.prismaService.facebookMessage.findFirst({
        where: { facebookPageId: pageId },
        orderBy: { sentAt: 'desc' },
        select: { sentAt: true },
      });

      const lastComment = await this.prismaService.facebookComment.findFirst({
        where: { pageId: pageId },
        orderBy: { createdTime: 'desc' },
        select: { createdTime: true },
      });

      let lastActivity: Date | undefined;
      if (lastMessage && lastComment) {
        lastActivity = lastMessage.sentAt > lastComment.createdTime 
          ? lastMessage.sentAt 
          : lastComment.createdTime;
      } else if (lastMessage) {
        lastActivity = lastMessage.sentAt;
      } else if (lastComment) {
        lastActivity = lastComment.createdTime;
      }

      return {
        messageCount,
        commentCount,
        lastActivity,
      };
    } catch (error) {
      this.logger.error('Error getting page stats:', error);
      return {
        messageCount: 0,
        commentCount: 0,
        lastActivity: undefined,
      };
    }
  }
}
