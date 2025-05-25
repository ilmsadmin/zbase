import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { FacebookAuthService } from './facebook-auth.service';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

export interface FacebookGraphResponse<T = any> {
  data?: T;
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
    next?: string;
    previous?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

export interface FacebookPageInfo {
  id: string;
  name: string;
  category: string;
  access_token: string;
  picture?: {
    data: {
      url: string;
    };
  };
  fan_count?: number;
  about?: string;
  website?: string;
  phone?: string;
  email?: string;
}

export interface FacebookMessage {
  id: string;
  message?: string;
  from: {
    name: string;
    email?: string;
    id: string;
  };
  to?: {
    data: Array<{
      name: string;
      email?: string;
      id: string;
    }>;
  };
  created_time: string;
  attachments?: {
    data: Array<{
      name?: string;
      mime_type?: string;
      size?: number;
      file_url?: string;
      image_data?: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

export interface FacebookComment {
  id: string;
  message: string;
  from: {
    name: string;
    id: string;
  };
  created_time: string;
  like_count?: number;
  comment_count?: number;
  parent?: {
    id: string;
  };
  can_hide?: boolean;
  can_remove?: boolean;
  can_comment?: boolean;
  can_like?: boolean;
}

@Injectable()
export class FacebookGraphService {
  private readonly logger = new Logger(FacebookGraphService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly facebookAuthService: FacebookAuthService,
  ) {
    const apiVersion = this.configService.get<string>('facebook.graphApiVersion', 'v22.0');
    this.baseUrl = `https://graph.facebook.com/${apiVersion}`;
  }

  /**
   * Make a GET request to Facebook Graph API
   */
  async get<T = any>(
    endpoint: string,
    accessToken: string,
    params: Record<string, any> = {},
  ): Promise<FacebookGraphResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const response: AxiosResponse<FacebookGraphResponse<T>> = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            access_token: accessToken,
            ...params,
          },
        }),
      );

      if (response.data.error) {
        this.logger.error('Facebook Graph API error:', response.data.error);
        throw new BadRequestException(`Facebook API error: ${response.data.error.message}`);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error making Facebook Graph API request:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to communicate with Facebook API');
    }
  }

  /**
   * Make a POST request to Facebook Graph API
   */
  async post<T = any>(
    endpoint: string,
    accessToken: string,
    data: Record<string, any> = {},
    params: Record<string, any> = {},
  ): Promise<FacebookGraphResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const response: AxiosResponse<FacebookGraphResponse<T>> = await firstValueFrom(
        this.httpService.post(
          url,
          data,
          {
            params: {
              access_token: accessToken,
              ...params,
            },
          },
        ),
      );

      if (response.data.error) {
        this.logger.error('Facebook Graph API error:', response.data.error);
        throw new BadRequestException(`Facebook API error: ${response.data.error.message}`);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error making Facebook Graph API POST request:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to communicate with Facebook API');
    }
  }

  /**
   * Make a DELETE request to Facebook Graph API
   */
  async delete<T = any>(
    endpoint: string,
    accessToken: string,
    params: Record<string, any> = {},
  ): Promise<FacebookGraphResponse<T>> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const response: AxiosResponse<FacebookGraphResponse<T>> = await firstValueFrom(
        this.httpService.delete(url, {
          params: {
            access_token: accessToken,
            ...params,
          },
        }),
      );

      if (response.data.error) {
        this.logger.error('Facebook Graph API error:', response.data.error);
        throw new BadRequestException(`Facebook API error: ${response.data.error.message}`);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error making Facebook Graph API DELETE request:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to communicate with Facebook API');
    }
  }

  /**
   * Get user's Facebook pages
   */
  async getUserPages(facebookUserId: string): Promise<FacebookPageInfo[]> {
    try {
      // Get Facebook user from database
      const facebookUser = await this.prismaService.facebookUser.findUnique({
        where: { id: facebookUserId },
      });

      if (!facebookUser) {
        throw new BadRequestException('Facebook user not found');
      }

      // Decrypt access token
      const accessToken = await this.facebookAuthService.decryptToken(facebookUser.accessToken);

      // Get pages from Facebook API
      const response = await this.get<FacebookPageInfo[]>(
        'me/accounts',
        accessToken,
        {
          fields: 'id,name,category,access_token,picture{url},fan_count,about,website,phone,email',
        },
      );

      return response.data || [];
    } catch (error) {
      this.logger.error('Error getting user pages:', error);
      throw error;
    }
  }

  /**
   * Get page conversations (messages)
   */
  async getPageConversations(
    pageId: string,
    pageAccessToken: string,
    limit: number = 10,
    after?: string,
  ): Promise<FacebookGraphResponse<FacebookMessage[]>> {
    try {
      const params: Record<string, any> = {
        fields: 'id,participants,updated_time,message_count',
        limit,
      };

      if (after) {
        params.after = after;
      }

      return await this.get<FacebookMessage[]>(
        `${pageId}/conversations`,
        pageAccessToken,
        params,
      );
    } catch (error) {
      this.logger.error('Error getting page conversations:', error);
      throw error;
    }
  }

  /**
   * Get messages from a conversation
   */
  async getConversationMessages(
    conversationId: string,
    pageAccessToken: string,
    limit: number = 25,
    after?: string,
  ): Promise<FacebookGraphResponse<FacebookMessage[]>> {
    try {
      const params: Record<string, any> = {
        fields: 'id,message,from,to,created_time,attachments{name,mime_type,size,file_url,image_data}',
        limit,
      };

      if (after) {
        params.after = after;
      }

      return await this.get<FacebookMessage[]>(
        `${conversationId}/messages`,
        pageAccessToken,
        params,
      );
    } catch (error) {
      this.logger.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(
    conversationId: string,
    pageAccessToken: string,
    message: string,
  ): Promise<{ id: string }> {
    try {
      const response = await this.post<{ id: string }>(
        `${conversationId}/messages`,
        pageAccessToken,
        {
          message,
        },
      );

      return response.data || { id: '' };
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get comments from a post
   */
  async getPostComments(
    postId: string,
    pageAccessToken: string,
    limit: number = 25,
    after?: string,
  ): Promise<FacebookGraphResponse<FacebookComment[]>> {
    try {
      const params: Record<string, any> = {
        fields: 'id,message,from,created_time,like_count,comment_count,parent,can_hide,can_remove,can_comment,can_like',
        limit,
        order: 'chronological',
      };

      if (after) {
        params.after = after;
      }

      return await this.get<FacebookComment[]>(
        `${postId}/comments`,
        pageAccessToken,
        params,
      );
    } catch (error) {
      this.logger.error('Error getting post comments:', error);
      throw error;
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(
    commentId: string,
    pageAccessToken: string,
    message: string,
  ): Promise<{ id: string }> {
    try {
      const response = await this.post<{ id: string }>(
        `${commentId}/comments`,
        pageAccessToken,
        {
          message,
        },
      );

      return response.data || { id: '' };
    } catch (error) {
      this.logger.error('Error replying to comment:', error);
      throw error;
    }
  }

  /**
   * Hide a comment
   */
  async hideComment(commentId: string, pageAccessToken: string): Promise<{ success: boolean }> {
    try {
      const response = await this.post<{ success: boolean }>(
        `${commentId}`,
        pageAccessToken,
        {
          is_hidden: true,
        },
      );

      return response.data || { success: false };
    } catch (error) {
      this.logger.error('Error hiding comment:', error);
      throw error;
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string, pageAccessToken: string): Promise<{ success: boolean }> {
    try {
      const response = await this.delete<{ success: boolean }>(
        commentId,
        pageAccessToken,
      );

      return response.data || { success: false };
    } catch (error) {
      this.logger.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Get page insights (analytics)
   */
  async getPageInsights(
    pageId: string,
    pageAccessToken: string,
    metrics: string[] = ['page_fans', 'page_impressions', 'page_engaged_users'],
    period: 'day' | 'week' | 'days_28' = 'day',
    since?: string,
    until?: string,
  ): Promise<FacebookGraphResponse<any[]>> {
    try {
      const params: Record<string, any> = {
        metric: metrics.join(','),
        period,
      };

      if (since) {
        params.since = since;
      }

      if (until) {
        params.until = until;
      }

      return await this.get<any[]>(
        `${pageId}/insights`,
        pageAccessToken,
        params,
      );
    } catch (error) {
      this.logger.error('Error getting page insights:', error);
      throw error;
    }
  }

  /**
   * Validate access token
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await this.get('me', accessToken, { fields: 'id' });
      return !response.error;
    } catch (error) {
      this.logger.warn('Access token validation failed:', error);
      return false;
    }
  }

  /**
   * Get app access token for webhook verification
   */
  getAppAccessToken(): string {
    const appId = this.configService.get('FACEBOOK_APP_ID');
    const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
    return `${appId}|${appSecret}`;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const appSecret = this.configService.get('FACEBOOK_APP_SECRET');
    
    const expectedSignature = 'sha256=' + 
      crypto.createHmac('sha256', appSecret)
        .update(payload)
        .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}
