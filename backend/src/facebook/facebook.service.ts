import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FacebookAuthService } from './services/facebook-auth.service';
import { FacebookPagesService } from './services/facebook-pages.service';
import { FacebookMessagesService } from './services/facebook-messages.service';
import { FacebookCommentsService } from './services/facebook-comments.service';
import { FacebookAnalyticsService } from './services/facebook-analytics.service';

@Injectable()
export class FacebookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: FacebookAuthService,
    private readonly pagesService: FacebookPagesService,
    private readonly messagesService: FacebookMessagesService,
    private readonly commentsService: FacebookCommentsService,
    private readonly analyticsService: FacebookAnalyticsService,
  ) {}

  /**
   * Get Facebook connection status for a user
   */
  async getConnectionStatus(userId: number) {
    const facebookUser = await this.prisma.facebookUser.findUnique({
      where: { userId },
      include: {
        pages: {
          where: { isConnected: true },
          select: {
            id: true,
            name: true,
            profilePicture: true,
            connectedAt: true,
          },
        },
      },
    });

    return {
      isConnected: !!facebookUser && facebookUser.isActive,
      facebookUser: facebookUser ? {
        id: facebookUser.id,
        name: facebookUser.name,
        email: facebookUser.email,
        profilePicture: facebookUser.profilePicture,
        connectedAt: facebookUser.connectedAt,
        lastSyncAt: facebookUser.lastSyncAt,
        scopes: facebookUser.scopes,
      } : null,
      connectedPages: facebookUser?.pages || [],
      totalPages: facebookUser?.pages.length || 0,
    };
  }

  /**
   * Get overview statistics for user's Facebook integration
   */
  async getOverviewStats(userId: number) {
    const facebookUser = await this.prisma.facebookUser.findUnique({
      where: { userId },
    });

    if (!facebookUser) {
      return {
        isConnected: false,
        stats: null,
      };
    }

    const [
      totalPages,
      connectedPages,
      totalMessages,
      unreadMessages,
      totalComments,
      pendingComments,
    ] = await Promise.all([
      this.prisma.facebookPage.count({
        where: { facebookUserId: facebookUser.id },
      }),
      this.prisma.facebookPage.count({
        where: { 
          facebookUserId: facebookUser.id,
          isConnected: true,
        },
      }),
      this.prisma.facebookMessage.count({
        where: { 
          page: { facebookUserId: facebookUser.id },
        },
      }),
      this.prisma.facebookMessage.count({
        where: { 
          page: { facebookUserId: facebookUser.id },
          isRead: false,
          isFromPage: false, // Only count incoming messages
        },
      }),
      this.prisma.facebookComment.count({
        where: { 
          page: { facebookUserId: facebookUser.id },
        },
      }),      this.prisma.facebookComment.count({
        where: { 
          page: { facebookUserId: facebookUser.id },
          status: 'PENDING',
        },
      }),
    ]);

    return {
      isConnected: true,
      stats: {
        pages: {
          total: totalPages,
          connected: connectedPages,
        },
        messages: {
          total: totalMessages,
          unread: unreadMessages,
        },
        comments: {
          total: totalComments,
          pending: pendingComments,
        },
      },
    };
  }

  /**
   * Disconnect Facebook account
   */
  async disconnectAccount(userId: number) {
    const facebookUser = await this.prisma.facebookUser.findUnique({
      where: { userId },
    });

    if (!facebookUser) {
      throw new Error('Facebook account not connected');
    }

    // Log the disconnection
    await this.prisma.facebookActivityLog.create({
      data: {
        action: 'disconnect_account',
        entityType: 'user',
        entityId: facebookUser.id,
        facebookUserId: facebookUser.id,
        systemUserId: userId,
        details: {
          reason: 'user_requested',
          timestamp: new Date(),
        },
        status: 'success',
      },
    });

    // Deactivate all pages
    await this.prisma.facebookPage.updateMany({
      where: { facebookUserId: facebookUser.id },
      data: { isConnected: false },
    });

    // Deactivate Facebook user
    await this.prisma.facebookUser.update({
      where: { id: facebookUser.id },
      data: { 
        isActive: false,
        accessToken: '', // Clear tokens for security
        refreshToken: '',
      },
    });

    return { success: true, message: 'Facebook account disconnected successfully' };
  }
}
