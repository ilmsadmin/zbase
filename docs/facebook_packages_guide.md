# Facebook Tools - Package Selection Guide

## 📦 Các Package Đã Chọn

### 1. **@nestjs/axios** & **axios**
- **Mục đích**: HTTP client chính thức cho NestJS để gọi Facebook Graph API
- **Lý do chọn**: 
  - Tích hợp sẵn với dependency injection của NestJS
  - Hỗ trợ interceptors, error handling
  - Performance tốt và ổn định
  - Được NestJS khuyến nghị

### 2. **passport-facebook** & **@types/passport-facebook**
- **Mục đích**: Facebook OAuth 2.0 authentication strategy
- **Lý do chọn**:
  - Tích hợp trực tiếp với Passport.js (đã có trong hệ thống)
  - Hỗ trợ OAuth flow chuẩn của Facebook
  - Maintained tốt và ổn định
  - Tương thích với cấu trúc auth hiện tại

### 3. **node-fetch** & **@types/node-fetch**
- **Mục đích**: Alternative HTTP client cho các tác vụ đặc biệt
- **Lý do chọn**:
  - Lightweight, tương thích với Fetch API chuẩn
  - Backup option cho axios
  - Hỗ trợ streaming cho file uploads
  - Modern promise-based API

## 🚫 Packages Không Chọn

### Facebook Business SDK
- **Lý do không chọn**: 
  - Quá nặng cho nhu cầu hiện tại
  - Chúng ta chỉ cần Facebook Pages API, không cần Ads API
  - Có thể cân nhắc trong tương lai nếu cần mở rộng

### passport-oauth2
- **Lý do không chọn**: 
  - passport-facebook đã bao gồm OAuth 2.0 functionality
  - Chuyên biệt cho Facebook tốt hơn generic OAuth

## 🔧 Cấu Hình Môi Trường

Thêm vào `.env` file:

```env
# Facebook App Configuration
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/facebook/auth/callback

# Facebook Graph API
FACEBOOK_GRAPH_API_VERSION=v18.0
FACEBOOK_GRAPH_API_BASE_URL=https://graph.facebook.com
```

## 🏗️ Cấu Trúc Module

```
src/facebook/
├── facebook.module.ts
├── facebook.controller.ts
├── facebook.service.ts
├── strategies/
│   └── facebook.strategy.ts
├── services/
│   ├── facebook-auth.service.ts
│   ├── facebook-graph.service.ts
│   ├── facebook-pages.service.ts
│   ├── facebook-messages.service.ts
│   └── facebook-comments.service.ts
├── dto/
│   ├── facebook-auth.dto.ts
│   ├── facebook-page.dto.ts
│   ├── facebook-message.dto.ts
│   └── facebook-comment.dto.ts
└── interfaces/
    ├── facebook-user.interface.ts
    ├── facebook-page.interface.ts
    └── facebook-api.interface.ts
```

## 🔗 API Endpoints Sẽ Implement

### Authentication
- `GET /api/facebook/auth` - Redirect to Facebook OAuth
- `GET /api/facebook/auth/callback` - Handle OAuth callback
- `POST /api/facebook/auth/refresh` - Refresh Facebook token

### Pages Management
- `GET /api/facebook/pages` - Get user's Facebook pages
- `POST /api/facebook/pages/:pageId/connect` - Connect a page
- `DELETE /api/facebook/pages/:pageId/disconnect` - Disconnect a page

### Messages
- `GET /api/facebook/pages/:pageId/messages` - Get page messages
- `POST /api/facebook/pages/:pageId/messages/:messageId/reply` - Reply to message
- `GET /api/facebook/pages/:pageId/messages/:messageId` - Get message details

### Comments
- `GET /api/facebook/pages/:pageId/posts/:postId/comments` - Get post comments
- `POST /api/facebook/pages/:pageId/comments/:commentId/reply` - Reply to comment
- `PUT /api/facebook/pages/:pageId/comments/:commentId/hide` - Hide comment
- `DELETE /api/facebook/pages/:pageId/comments/:commentId` - Delete comment

### Analytics
- `GET /api/facebook/pages/:pageId/analytics` - Get page analytics
- `GET /api/facebook/analytics/summary` - Get summary analytics

## 🔐 Security Features

1. **Token Management**: Facebook tokens sẽ được lưu encrypted trong database
2. **Rate Limiting**: Implement rate limiting cho Facebook API calls
3. **Webhook Verification**: Verify Facebook webhook signatures
4. **Permission Validation**: Kiểm tra Facebook permissions trước khi gọi API

## 🚀 Next Steps

1. **Phase 1**: Implement basic authentication với Facebook OAuth
2. **Phase 2**: Facebook Pages connection và management
3. **Phase 3**: Messages và Comments functionality
4. **Phase 4**: Analytics và reporting
5. **Phase 5**: Real-time webhooks integration

## 📋 Facebook App Requirements

Cần tạo Facebook App với permissions:
- `pages_show_list` - Xem danh sách pages
- `pages_read_engagement` - Đọc interactions
- `pages_manage_metadata` - Quản lý page info
- `pages_messaging` - Gửi/nhận messages
- `pages_manage_posts` - Quản lý posts và comments

## 🔍 Testing Strategy

- Unit tests cho mỗi service
- Integration tests cho Facebook API calls
- E2E tests cho complete workflows
- Mock Facebook API responses cho development
