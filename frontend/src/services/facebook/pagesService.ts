import { apiClient } from '../apiClient';

export interface FacebookPage {
  id: string;
  userId: string;
  facebookPageId: string;
  name: string;
  category: string;
  about?: string;
  website?: string;
  phone?: string;
  email?: string;
  profilePictureUrl?: string;
  coverPhotoUrl?: string;
  followers?: number;
  isActive: boolean;
  accessToken: string;
  permissions: string[];
  syncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncPagesRequest {
  forceRefresh?: boolean;
}

export interface UpdatePageRequest {
  isActive?: boolean;
  autoReply?: boolean;
  autoReplyMessage?: string;
}

export interface PageFilters {
  search?: string;
  category?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface PagesListResponse {
  success: boolean;
  data: FacebookPage[];
  total: number;
  message: string;
}

export class FacebookPagesService {
  private baseUrl = '/facebook/pages';

  /**
   * Get all Facebook pages
   */
  async getPages(filters?: PageFilters): Promise<PagesListResponse> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());

      const response = await apiClient.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get Facebook pages:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get pages');
    }
  }

  /**
   * Get specific Facebook page by ID
   */
  async getPageById(pageId: string): Promise<FacebookPage> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${pageId}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get Facebook page:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get page');
    }
  }

  /**
   * Sync pages from Facebook
   */
  async syncPages(data?: SyncPagesRequest): Promise<{ success: boolean; message: string; data: FacebookPage[] }> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/sync`, data || {});
      return response.data;
    } catch (error: any) {
      console.error('Failed to sync Facebook pages:', error);
      throw new Error(error?.response?.data?.message || 'Failed to sync pages');
    }
  }

  /**
   * Update page settings
   */
  async updatePage(pageId: string, data: UpdatePageRequest): Promise<FacebookPage> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${pageId}`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to update Facebook page:', error);
      throw new Error(error?.response?.data?.message || 'Failed to update page');
    }
  }

  /**
   * Toggle page active status
   */
  async togglePageStatus(pageId: string): Promise<FacebookPage> {
    try {
      const response = await apiClient.patch(`${this.baseUrl}/${pageId}/toggle`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to toggle page status:', error);
      throw new Error(error?.response?.data?.message || 'Failed to toggle page status');
    }
  }

  /**
   * Delete page from local database (doesn't affect Facebook)
   */
  async deletePage(pageId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`${this.baseUrl}/${pageId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete Facebook page:', error);
      throw new Error(error?.response?.data?.message || 'Failed to delete page');
    }
  }

  /**
   * Get page insights/analytics
   */
  async getPageInsights(pageId: string, period?: string): Promise<any> {
    try {
      const params = period ? `?period=${period}` : '';
      const response = await apiClient.get(`${this.baseUrl}/${pageId}/insights${params}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get page insights:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get page insights');
    }
  }

  /**
   * Test page connection
   */
  async testPageConnection(pageId: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${pageId}/test`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to test page connection:', error);
      throw new Error(error?.response?.data?.message || 'Failed to test page connection');
    }
  }
}

export const facebookPagesService = new FacebookPagesService();
