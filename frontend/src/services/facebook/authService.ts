import { apiClient } from '../apiClient';

export interface FacebookAuthConfig {
  success: boolean;
  data?: {
    authUrl: string;
  };
  message: string;
}

export interface FacebookConnection {
  id: string;
  userId: string;
  facebookUserId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt: string;
  permissions: string[];
  isActive: boolean;
  connectedAt: string;
  lastSyncAt?: string;
}

export interface ConnectFacebookRequest {
  code: string;
  state?: string;
  redirectUri?: string;
}

export class FacebookAuthService {
  private baseUrl = '/facebook/auth';

  /**
   * Get Facebook OAuth authorization URL
   */
  async getAuthorizationUrl(): Promise<FacebookAuthConfig> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/connect`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get Facebook authorization URL:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get authorization URL');
    }
  }

  /**
   * Handle Facebook OAuth callback
   */
  async handleCallback(data: ConnectFacebookRequest): Promise<FacebookConnection> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/callback`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to handle Facebook callback:', error);
      throw new Error(error?.response?.data?.message || 'Failed to connect Facebook account');
    }
  }

  /**
   * Get current Facebook connection status
   */
  async getConnectionStatus(): Promise<FacebookConnection | null> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/status`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get connection status:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get connection status');
    }
  }

  /**
   * Disconnect Facebook account
   */
  async disconnect(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/disconnect`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to disconnect Facebook account:', error);
      throw new Error(error?.response?.data?.message || 'Failed to disconnect Facebook account');
    }
  }

  /**
   * Refresh Facebook access token
   */
  async refreshToken(): Promise<FacebookConnection> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/refresh-token`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to refresh Facebook token:', error);
      throw new Error(error?.response?.data?.message || 'Failed to refresh token');
    }
  }

  /**
   * Test Facebook connection
   */
  async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/test`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to test Facebook connection:', error);
      throw new Error(error?.response?.data?.message || 'Failed to test connection');
    }
  }
}

export const facebookAuthService = new FacebookAuthService();
