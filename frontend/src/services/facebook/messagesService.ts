import { apiClient } from '../apiClient';

export interface FacebookMessage {
  id: string;
  conversationId: string;
  facebookPageId: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: any[];
  createdAt: string;
  updatedAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'UNREAD';
  type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'FILE' | 'STICKER';
  isFromPage: boolean;
  sender?: {
    name: string;
    id: string;
    profilePicture?: string;
  };
  recipient?: {
    name: string;
    id: string;
    profilePicture?: string;
  };
}

export interface Conversation {
  id: string;
  participants: Array<{
    name: string;
    id: string;
    profilePicture?: string;
    email?: string;
  }>;
  lastMessage?: {
    id: string;
    content: string;
    from: string;
    createdAt: string;
  };
  messageCount: number;
  unreadCount: number;
  updatedAt: string;
  pageId: string;
  pageName: string;
}

export interface SendMessageRequest {
  pageId: string;
  conversationId: string;
  message: string;
  attachmentUrl?: string;
}

export interface MessageFilter {
  pageId?: string;
  limit?: number;
  after?: string;
  searchTerm?: string;
  unreadOnly?: boolean;
}

export class FacebookMessagesService {
  private baseUrl = '/facebook/messages';

  /**
   * Get conversations for a page
   */
  async getConversations(params: MessageFilter): Promise<{ conversations: Conversation[], nextCursor?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageId) queryParams.append('pageId', params.pageId);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.after) queryParams.append('after', params.after);
      
      const response = await apiClient.get(`${this.baseUrl}/conversations?${queryParams.toString()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get conversations:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get conversations');
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(pageId: string, conversationId: string, limit: number = 20, before?: string): Promise<{ messages: FacebookMessage[], nextCursor?: string }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('pageId', pageId);
      queryParams.append('limit', limit.toString());
      if (before) queryParams.append('before', before);

      const response = await apiClient.get(`${this.baseUrl}/conversations/${conversationId}/messages?${queryParams.toString()}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get messages:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get messages');
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(data: SendMessageRequest): Promise<FacebookMessage> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/send`, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw new Error(error?.response?.data?.message || 'Failed to send message');
    }
  }

  /**
   * Mark messages as read
   */
  async markAsRead(pageId: string, conversationId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/conversations/${conversationId}/read`, {
        pageId,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
      throw new Error(error?.response?.data?.message || 'Failed to mark messages as read');
    }
  }
  /**
   * Get pages with messenger enabled
   */
  async getMessengerPages(): Promise<any[]> {
    try {
      // Use the Facebook Pages API endpoint instead of the non-existent messages/pages endpoint
      const response = await apiClient.get('/facebook/pages');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to get messenger pages:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get messenger pages');
    }
  }
}

export const facebookMessagesService = new FacebookMessagesService();
