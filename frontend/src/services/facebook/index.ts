// Export all Facebook services
export { FacebookAuthService, facebookAuthService } from './authService';
export { FacebookPagesService, facebookPagesService } from './pagesService';
export { FacebookMessagesService, facebookMessagesService } from './messagesService';

// Export types
export type { 
  FacebookAuthConfig, 
  FacebookConnection, 
  ConnectFacebookRequest 
} from './authService';

export type { 
  FacebookPage, 
  SyncPagesRequest, 
  UpdatePageRequest, 
  PageFilters, 
  PagesListResponse 
} from './pagesService';

export type {
  FacebookMessage,
  Conversation,
  SendMessageRequest,
  MessageFilter
} from './messagesService';
