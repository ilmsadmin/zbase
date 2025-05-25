# Facebook Tools Module Design Document

## Tổng quan

Module Facebook Tools được thiết kế để tích hợp với Facebook Graph API, cho phép người dùng quản lý nhiều Facebook pages, đọc và trả lời tin nhắn, quản lý bình luận và xem tương tác từ một giao diện tập trung.

## Kiến trúc hệ thống

### 1. Backend Architecture (NestJS)

#### 1.1 Facebook Module Structure
```
backend/src/facebook/
├── facebook.module.ts
├── controllers/
│   ├── facebook-auth.controller.ts
│   ├── facebook-pages.controller.ts
│   ├── facebook-messages.controller.ts
│   └── facebook-comments.controller.ts
├── services/
│   ├── facebook-auth.service.ts
│   ├── facebook-graph.service.ts
│   ├── facebook-pages.service.ts
│   ├── facebook-messages.service.ts
│   └── facebook-comments.service.ts
├── dto/
│   ├── auth/
│   ├── pages/
│   ├── messages/
│   └── comments/
├── entities/
│   ├── facebook-user.entity.ts
│   ├── facebook-page.entity.ts
│   ├── facebook-message.entity.ts
│   └── facebook-comment.entity.ts
├── guards/
│   └── facebook-auth.guard.ts
└── interfaces/
    └── facebook-graph.interface.ts
```

#### 1.2 Database Schema (Prisma)

```prisma
// Facebook User Connection - Lưu thông tin kết nối của user với Facebook
model FacebookUser {
  id          Int      @id @default(autoincrement())
  userId      Int      // User ID từ hệ thống zbase
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  facebookId  String   @unique // Facebook User ID
  accessToken String   // Facebook Access Token (mã hóa)
  tokenExpiry DateTime // Thời gian hết hạn token
  isActive    Boolean  @default(true)
  pages       FacebookPage[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("facebook_users")
}

// Facebook Pages mà user quản lý
model FacebookPage {
  id             Int         @id @default(autoincrement())
  facebookUserId Int
  facebookUser   FacebookUser @relation(fields: [facebookUserId], references: [id], onDelete: Cascade)
  pageId         String      @unique // Facebook Page ID
  pageName       String
  pageAccessToken String     // Page Access Token (mã hóa)
  isSelected     Boolean     @default(false) // Page được chọn để quản lý
  isActive       Boolean     @default(true)
  messages       FacebookMessage[]
  comments       FacebookComment[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@map("facebook_pages")
}

// Tin nhắn Facebook
model FacebookMessage {
  id           Int         @id @default(autoincrement())
  pageId       Int
  page         FacebookPage @relation(fields: [pageId], references: [id], onDelete: Cascade)
  messageId    String      @unique // Facebook Message ID
  senderId     String      // Facebook User ID của người gửi
  senderName   String
  content      String?     // Nội dung tin nhắn
  timestamp    DateTime    // Thời gian tin nhắn
  isRead       Boolean     @default(false)
  isReplied    Boolean     @default(false)
  replyContent String?     // Nội dung reply (nếu có)
  attachments  Json?       // Đính kèm (images, files, etc.)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("facebook_messages")
}

// Bình luận Facebook
model FacebookComment {
  id          Int         @id @default(autoincrement())
  pageId      Int
  page        FacebookPage @relation(fields: [pageId], references: [id], onDelete: Cascade)
  commentId   String      @unique // Facebook Comment ID
  postId      String      // Facebook Post ID
  parentId    String?     // Parent comment ID (cho nested comments)
  authorId    String      // Facebook User ID của người comment
  authorName  String
  content     String      // Nội dung comment
  timestamp   DateTime    // Thời gian comment
  isHidden    Boolean     @default(false)
  isReplied   Boolean     @default(false)
  replyContent String?    // Nội dung reply (nếu có)
  likeCount   Int         @default(0)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("facebook_comments")
}

// Logs hoạt động Facebook
model FacebookActivityLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  action    String   // 'reply_message', 'reply_comment', 'hide_comment', etc.
  targetType String  // 'message', 'comment'
  targetId  String   // ID của message/comment
  details   Json?    // Chi tiết hoạt động
  createdAt DateTime @default(now())

  @@map("facebook_activity_logs")
}
```

#### 1.3 API Endpoints

##### Authentication Endpoints
```
POST   /api/facebook/auth/connect          - Kết nối với Facebook
DELETE /api/facebook/auth/disconnect       - Ngắt kết nối Facebook
GET    /api/facebook/auth/status           - Kiểm tra trạng thái kết nối
POST   /api/facebook/auth/refresh-token    - Refresh token
```

##### Pages Management
```
GET    /api/facebook/pages                 - Lấy danh sách pages
POST   /api/facebook/pages/sync            - Đồng bộ pages từ Facebook
PUT    /api/facebook/pages/:id/select      - Chọn page để quản lý
PUT    /api/facebook/pages/:id/deselect    - Bỏ chọn page
```

##### Messages Management
```
GET    /api/facebook/messages              - Lấy danh sách tin nhắn
GET    /api/facebook/messages/:id          - Chi tiết tin nhắn
POST   /api/facebook/messages/:id/reply    - Trả lời tin nhắn
PUT    /api/facebook/messages/:id/read     - Đánh dấu đã đọc
POST   /api/facebook/messages/sync         - Đồng bộ tin nhắn mới
```

##### Comments Management
```
GET    /api/facebook/comments              - Lấy danh sách bình luận
GET    /api/facebook/comments/:id          - Chi tiết bình luận
POST   /api/facebook/comments/:id/reply    - Trả lời bình luận
PUT    /api/facebook/comments/:id/hide     - Ẩn bình luận
DELETE /api/facebook/comments/:id          - Xóa bình luận
POST   /api/facebook/comments/sync         - Đồng bộ comments mới
```

##### Analytics & Reports
```
GET    /api/facebook/analytics/overview    - Tổng quan tương tác
GET    /api/facebook/analytics/messages    - Thống kê tin nhắn
GET    /api/facebook/analytics/comments    - Thống kê bình luận
```

### 2. Frontend Architecture (Next.js)

#### 2.1 Route Structure
```
frontend/src/app/(admin)/facebook/
├── page.tsx                    - Dashboard Facebook
├── setup/
│   └── page.tsx               - Thiết lập kết nối Facebook
├── pages/
│   └── page.tsx               - Quản lý Pages
├── messages/
│   ├── page.tsx               - Danh sách tin nhắn
│   └── [id]/page.tsx          - Chi tiết tin nhắn
├── comments/
│   ├── page.tsx               - Danh sách bình luận
│   └── [id]/page.tsx          - Chi tiết bình luận
└── analytics/
    └── page.tsx               - Báo cáo thống kê
```

#### 2.2 Component Structure
```
frontend/src/components/facebook/
├── auth/
│   ├── FacebookConnectButton.tsx
│   ├── FacebookSetupWizard.tsx
│   └── ConnectionStatus.tsx
├── pages/
│   ├── PageSelector.tsx
│   ├── PageCard.tsx
│   └── PageSyncButton.tsx
├── messages/
│   ├── MessageList.tsx
│   ├── MessageCard.tsx
│   ├── MessageDetail.tsx
│   ├── MessageReplyForm.tsx
│   └── MessageFilters.tsx
├── comments/
│   ├── CommentList.tsx
│   ├── CommentCard.tsx
│   ├── CommentDetail.tsx
│   ├── CommentReplyForm.tsx
│   └── CommentFilters.tsx
├── analytics/
│   ├── OverviewStats.tsx
│   ├── MessageStats.tsx
│   └── CommentStats.tsx
└── shared/
    ├── FacebookIcon.tsx
    ├── SyncIndicator.tsx
    └── ActivityIndicator.tsx
```

#### 2.3 Services & API Integration
```
frontend/src/services/facebook/
├── authService.ts           - Xử lý authentication
├── pagesService.ts          - Quản lý pages
├── messagesService.ts       - Quản lý messages
├── commentsService.ts       - Quản lý comments
└── analyticsService.ts      - Lấy dữ liệu analytics
```

## 3. Quy trình hoạt động

### 3.1 Facebook Authorization Flow
1. User click "Kết nối Facebook" trên trang /facebook/setup
2. Redirect đến Facebook OAuth với scope: `pages_messaging`, `pages_read_engagement`, `pages_manage_metadata`
3. Facebook callback với authorization code
4. Backend exchange code để lấy access token
5. Lưu token vào database (mã hóa)
6. Sync danh sách pages mà user quản lý

### 3.2 Message Management Flow
1. Auto-sync tin nhắn mới từ Facebook API (webhook hoặc polling)
2. Hiển thị danh sách tin nhắn theo thời gian real-time
3. User click vào tin nhắn để xem chi tiết
4. User reply trực tiếp từ giao diện zbase
5. Log hoạt động vào database

### 3.3 Comment Management Flow
1. Auto-sync comments từ posts của pages
2. Hiển thị comments theo post/thời gian
3. User có thể reply, hide hoặc delete comments
4. Real-time update trạng thái interactions

## 4. Bảo mật

### 4.1 Token Security
- Mã hóa access tokens trong database
- Implement token refresh mechanism
- Set up token expiry monitoring

### 4.2 Permission Controls
- Chỉ admin hoặc users có quyền `facebook:manage` mới truy cập được
- Row-level security cho multi-tenant (nếu cần)
- Audit logs cho mọi hoạt động

### 4.3 Rate Limiting
- Implement rate limiting cho Facebook API calls
- Cache frequently accessed data
- Error handling cho API limits

## 5. Real-time Features

### 5.1 WebSocket Integration
- Real-time notifications cho tin nhắn mới
- Live updates cho comments
- Connection status indicators

### 5.2 Background Jobs
- Scheduled sync cho messages/comments
- Token refresh automation
- Cleanup old data

## 6. Monitoring & Analytics

### 6.1 Dashboard Metrics
- Số lượng tin nhắn mới/ngày
- Response time trung bình
- Engagement rate
- Page performance comparison

### 6.2 Alerts & Notifications
- Facebook API errors
- Token expiry warnings
- High message volume alerts

## 7. Performance Considerations

### 7.1 Caching Strategy
- Redis cache cho frequently accessed data
- Paginated lists với infinite scroll
- Lazy loading cho attachments

### 7.2 Database Optimization
- Proper indexing cho search queries
- Data archiving cho old messages/comments
- Connection pooling optimization

## 8. Facebook API Integration Details

### 8.1 Required Facebook App Setup
- Facebook App với Business verification
- Webhooks configuration cho real-time updates
- App permissions: `pages_messaging`, `pages_read_engagement`, `pages_manage_metadata`

### 8.2 API Version & Compatibility
- Sử dụng Facebook Graph API v18.0+
- Backward compatibility handling
- Regular API version updates

This design ensures a comprehensive Facebook management system that integrates seamlessly with the existing zbase architecture while providing powerful social media management capabilities.
