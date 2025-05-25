import { apiClient } from '../apiClient';

export interface FacebookAuthConfig {
  success: boolean;
  data?: {
    authUrl: string;
  };
  message: string;
}

export interface FacebookConnection {
  id?: string;
  userId?: string;
  facebookUserId?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: string;
  permissions?: string[];
  isActive?: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  isConnected?: boolean;
  facebookUser?: any;
  connectedPages?: any[];
  totalPages?: number;
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
  async getConnectionStatus(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/status`);
      // Make sure we return a consistent format
      if (response.data && typeof response.data === 'object') {
        // If response already has success/message format, return it
        if ('success' in response.data) {
          return response.data;
        }
        // Otherwise, wrap the data in our standard format
        return {
          success: true,
          message: 'Connection status retrieved successfully',
          data: response.data.data || response.data
        };
      }
      return {
        success: true,
        message: 'Connection status retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Failed to get connection status:', error);
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to get connection status',
        data: null
      };
    }
  }

  /**
   * Disconnect Facebook account
   */
  async disconnect(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Use POST instead of DELETE - the backend endpoint is POST /facebook/auth/disconnect
      const response = await apiClient.post(`${this.baseUrl}/disconnect`);
      
      // Return standardized response format
      if (response.data && typeof response.data === 'object') {
        if ('success' in response.data) {
          return response.data;
        }
        return {
          success: true,
          message: 'Facebook account disconnected successfully',
          data: response.data
        };
      }
      return {
        success: true,
        message: 'Facebook account disconnected successfully'
      };
    } catch (error: any) {
      console.error('Failed to disconnect Facebook account:', error);
      
      // Instead of throwing an error, return a standardized error response
      return {
        success: false,
        message: error?.response?.data?.message || 'Failed to disconnect Facebook account'
      };
    }
  }

  /**
   * Refresh Facebook access token
   */
  async refreshToken(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Update endpoint to use /refresh instead of /refresh-token
      const response = await apiClient.post(`${this.baseUrl}/refresh`);
      
      // Make sure we return a consistent format
      if (response.data && typeof response.data === 'object') {
        // If response already has success/message format, return it
        if ('success' in response.data) {
          return response.data;
        }
        // Otherwise, wrap the data in our standard format
        return {
          success: true,
          message: 'Token refreshed successfully',
          data: response.data.data || response.data
        };
      }
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Failed to refresh Facebook token:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to refresh token';
      return {
        success: false,
        message: errorMessage
      };
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
