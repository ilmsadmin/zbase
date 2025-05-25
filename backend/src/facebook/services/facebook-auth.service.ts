import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

export interface FacebookAuthResult {
  facebookUser: {
    id: string;
    name: string;
    email?: string;
    profilePicture?: string;
  };
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
}

@Injectable()
export class FacebookAuthService {
  private readonly logger = new Logger(FacebookAuthService.name);
  private readonly facebookAppId: string;
  private readonly facebookAppSecret: string;
  private readonly callbackUrl: string;
  private readonly graphApiVersion: string;
  private readonly encryptionKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.facebookAppId = this.configService.get<string>('FACEBOOK_APP_ID') || '';
    this.facebookAppSecret = this.configService.get<string>('FACEBOOK_APP_SECRET') || '';
    this.callbackUrl = this.configService.get<string>('FACEBOOK_CALLBACK_URL') || 'http://localhost:3000/api/facebook/auth/callback';
    this.graphApiVersion = this.configService.get<string>('FACEBOOK_GRAPH_API_VERSION', 'v18.0');
    this.encryptionKey = this.configService.get<string>('FACEBOOK_TOKEN_ENCRYPTION_KEY') || 'default-key-change-in-production';

    if (!this.facebookAppId || !this.facebookAppSecret) {
      this.logger.error('Facebook App ID and Secret must be configured');
    }
  }

  /**
   * Generate Facebook OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const scopes = [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_metadata', 
      'pages_messaging',
      'pages_manage_posts',
      'public_profile',
      'email',
    ].join(',');

    const params = new URLSearchParams({
      client_id: this.facebookAppId,
      redirect_uri: this.callbackUrl,
      scope: scopes,
      response_type: 'code',
      ...(state && { state }),
    });

    return `https://www.facebook.com/${this.graphApiVersion}/dialog/oauth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<FacebookAuthResult> {
    try {
      // Exchange code for access token
      const tokenResponse = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/oauth/access_token`, {
          params: {
            client_id: this.facebookAppId,
            client_secret: this.facebookAppSecret,
            redirect_uri: this.callbackUrl,
            code,
          },
        })
      );

      const { access_token, expires_in } = tokenResponse.data;

      if (!access_token) {
        throw new UnauthorizedException('Failed to obtain access token from Facebook');
      }

      // Get user information
      const userResponse = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/me`, {
          params: {
            access_token,
            fields: 'id,name,email,picture.type(large)',
          },
        })
      );

      const userData = userResponse.data;

      // Get granted permissions
      const permissionsResponse = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/me/permissions`, {
          params: {
            access_token,
          },
        })
      );

      const grantedScopes = permissionsResponse.data.data
        .filter((perm: any) => perm.status === 'granted')
        .map((perm: any) => perm.permission);

      const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : undefined;

      return {
        facebookUser: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          profilePicture: userData.picture?.data?.url,
        },
        accessToken: access_token,
        expiresAt,
        scopes: grantedScopes,
      };
    } catch (error) {
      this.logger.error('Failed to exchange code for token:', error.response?.data || error.message);
      throw new UnauthorizedException('Facebook authentication failed');
    }
  }

  /**
   * Store Facebook user connection in database
   */
  async storeFacebookUser(userId: number, authResult: FacebookAuthResult) {
    const encryptedAccessToken = this.encryptToken(authResult.accessToken);
    const encryptedRefreshToken = authResult.refreshToken ? this.encryptToken(authResult.refreshToken) : null;

    const facebookUser = await this.prisma.facebookUser.upsert({
      where: { userId },
      update: {
        email: authResult.facebookUser.email,
        name: authResult.facebookUser.name,
        profilePicture: authResult.facebookUser.profilePicture,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: authResult.expiresAt,
        scopes: authResult.scopes,
        isActive: true,
        lastSyncAt: new Date(),
      },
      create: {
        id: authResult.facebookUser.id,
        userId,
        email: authResult.facebookUser.email,
        name: authResult.facebookUser.name,
        profilePicture: authResult.facebookUser.profilePicture,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: authResult.expiresAt,
        scopes: authResult.scopes,
        isActive: true,
      },
    });

    // Log the connection
    await this.prisma.facebookActivityLog.create({
      data: {
        action: 'connect_account',
        entityType: 'user',
        entityId: authResult.facebookUser.id,
        facebookUserId: authResult.facebookUser.id,
        systemUserId: userId,
        details: {
          scopes: authResult.scopes,
          connectedAt: new Date(),
        },
        status: 'success',
      },
    });

    return facebookUser;
  }

  /**
   * Get decrypted access token for a user
   */
  async getAccessToken(userId: number): Promise<string | null> {
    const facebookUser = await this.prisma.facebookUser.findUnique({
      where: { userId },
    });

    if (!facebookUser || !facebookUser.isActive) {
      return null;
    }

    // Check if token is expired
    if (facebookUser.tokenExpiresAt && facebookUser.tokenExpiresAt < new Date()) {
      this.logger.warn(`Access token expired for user ${userId}`);
      return null;
    }

    try {
      return this.decryptToken(facebookUser.accessToken);
    } catch (error) {
      this.logger.error('Failed to decrypt access token:', error.message);
      return null;
    }
  }

  /**
   * Refresh Facebook access token
   */
  async refreshAccessToken(userId: number): Promise<string | null> {
    const facebookUser = await this.prisma.facebookUser.findUnique({
      where: { userId },
    });

    if (!facebookUser || !facebookUser.refreshToken) {
      return null;
    }

    try {
      const refreshToken = this.decryptToken(facebookUser.refreshToken);
      
      const response = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/oauth/access_token`, {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: this.facebookAppId,
            client_secret: this.facebookAppSecret,
            fb_exchange_token: refreshToken,
          },
        })
      );

      const { access_token, expires_in } = response.data;
      const encryptedToken = this.encryptToken(access_token);
      const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;

      await this.prisma.facebookUser.update({
        where: { userId },
        data: {
          accessToken: encryptedToken,
          tokenExpiresAt: expiresAt,
          lastSyncAt: new Date(),
        },
      });

      return access_token;
    } catch (error) {
      this.logger.error('Failed to refresh access token:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Validate Facebook access token
   */
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/me`, {
          params: {
            access_token: accessToken,
            fields: 'id',
          },
        })
      );

      return !!response.data.id;
    } catch (error) {
      this.logger.error('Token validation failed:', error.response?.data || error.message);
      return false;
    }
  }
  /**
   * Encrypt token for secure storage
   */  public encryptToken(token: string): string {
    if (!this.encryptionKey) {
      this.logger.warn('No encryption key configured, storing token in plain text');
      return token;
    }

    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = crypto.randomBytes(16);
      
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(token, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      this.logger.error('Failed to encrypt token:', error.message);
      return token; // Fallback to plain text
    }
  }
  /**
   * Decrypt token from storage
   */  public decryptToken(encryptedToken: string): string {
    if (!this.encryptionKey) {
      return encryptedToken; // Assume plain text if no encryption key
    }

    try {
      const parts = encryptedToken.split(':');
      if (parts.length !== 2) {
        // Assume it's a plain text token
        return encryptedToken;
      }

      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      this.logger.error('Failed to decrypt token:', error.message);
      throw error;
    }
  }

  /**
   * Handle Facebook OAuth callback
   */
  async handleCallback(userId: number, code: string, state?: string): Promise<FacebookAuthResult> {
    try {
      // Validate state parameter if provided
      if (state && state !== userId.toString()) {
        throw new UnauthorizedException('Invalid state parameter');
      }

      // Exchange code for access token
      const authResult = await this.exchangeCodeForToken(code);
      
      // Store Facebook user data
      await this.storeFacebookUser(userId, authResult);
      
      return authResult;
    } catch (error) {
      this.logger.error('Failed to handle Facebook callback:', error.message);
      throw error;
    }
  }
  /**
   * Get Facebook connection status for user
   */
  async getConnectionStatus(userId: number) {
    try {
      const facebookUser = await this.prisma.facebookUser.findUnique({
        where: { userId },
        include: {
          pages: {
            where: { isConnected: true },
            select: {
              id: true,
              name: true,
              isConnected: true,
              lastSyncAt: true,
            },
          },
        },
      });

      if (!facebookUser) {
        return {
          isConnected: false,
          user: null,
          pages: [],
          lastSync: null,
        };
      }

      // Check if token is still valid
      const isTokenValid = await this.validateAccessToken(
        this.decryptToken(facebookUser.accessToken)
      );

      return {
        isConnected: isTokenValid,
        user: {
          facebookUserId: facebookUser.id,
          name: facebookUser.name,
          email: facebookUser.email,
          profilePicture: facebookUser.profilePicture,
        },
        pages: facebookUser.pages,
        lastSync: facebookUser.lastSyncAt,
        tokenExpiresAt: facebookUser.tokenExpiresAt,
      };
    } catch (error) {
      this.logger.error('Failed to get connection status:', error.message);
      throw error;
    }
  }

  /**
   * Refresh Facebook access token
   */
  async refreshToken(userId: number) {
    try {
      const newToken = await this.refreshAccessToken(userId);
      
      if (!newToken) {
        throw new UnauthorizedException('Failed to refresh Facebook token');
      }

      return {
        accessToken: newToken,
        refreshedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to refresh token:', error.message);
      throw error;
    }
  }
  /**
   * Validate Facebook connection for a user
   */
  async validateConnection(userId: number): Promise<boolean> {
    try {
      const facebookUser = await this.prisma.facebookUser.findUnique({
        where: { userId },
      });

      if (!facebookUser) {
        return false;
      }

      // Check if token is still valid by making a test API call
      const decryptedToken = this.decryptToken(facebookUser.accessToken);
      
      try {
        await firstValueFrom(
          this.httpService.get(`https://graph.facebook.com/${this.graphApiVersion}/me`, {
            params: {
              access_token: decryptedToken,
            },
          })
        );
        return true;
      } catch (apiError) {
        this.logger.warn(`Facebook token validation failed for user ${userId}:`, apiError.response?.data || apiError.message);
        return false;
      }
    } catch (error) {
      this.logger.error('Failed to validate Facebook connection:', error.message);
      return false;
    }
  }

  /**
   * Disconnect Facebook account from user
   */
  async disconnect(userId: number): Promise<void> {
    try {
      // Get the current Facebook user to revoke token
      const facebookUser = await this.prisma.facebookUser.findUnique({
        where: { userId },
      });

      if (facebookUser) {
        // Revoke the access token on Facebook's side
        try {
          const accessToken = this.decryptToken(facebookUser.accessToken);
          await firstValueFrom(
            this.httpService.delete(`https://graph.facebook.com/${this.graphApiVersion}/me/permissions`, {
              params: {
                access_token: accessToken,
              },
            })
          );
        } catch (error) {
          this.logger.warn('Failed to revoke token on Facebook side:', error.message);
          // Continue with local cleanup even if Facebook revocation fails
        }

        // Delete all related data
        await this.prisma.$transaction([
          // Delete comments
          this.prisma.facebookComment.deleteMany({
            where: {
              page: {
                facebookUserId: facebookUser.id,
              },
            },
          }),
          // Delete messages
          this.prisma.facebookMessage.deleteMany({
            where: {
              page: {
                facebookUserId: facebookUser.id,
              },
            },
          }),
          // Delete pages
          this.prisma.facebookPage.deleteMany({
            where: {
              facebookUserId: facebookUser.id,
            },
          }),
          // Delete Facebook user
          this.prisma.facebookUser.delete({
            where: { userId },
          }),
        ]);
      }    } catch (error) {
      this.logger.error('Failed to disconnect Facebook account:', error.message);
      throw error;
    }
  }
}
