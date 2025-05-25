// Export all Facebook services
export { FacebookAuthService, facebookAuthService } from './authService';
export { FacebookPagesService, facebookPagesService } from './pagesService';

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
