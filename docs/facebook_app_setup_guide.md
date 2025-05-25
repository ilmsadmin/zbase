# Facebook App Setup Guide for ZBase

## Bước 1: Tạo Facebook App

### 1.1 Truy cập Facebook Developers
1. Vào https://developers.facebook.com/
2. Đăng nhập bằng tài khoản Facebook
3. Nhấp "My Apps" > "Create App"

### 1.2 Chọn App Type
- Chọn **"Business"** cho ứng dụng kinh doanh
- Hoặc **"Consumer"** cho ứng dụng cá nhân

### 1.3 Điền thông tin App
```
App Name: ZBase Facebook Integration
App Contact Email: your-email@example.com
Business Account: (optional)
```

## Bước 2: Cấu hình Products

### 2.1 Thêm Facebook Login
1. Trong App Dashboard, tìm "Facebook Login"
2. Nhấp "Set up"
3. Chọn "Web" platform

### 2.2 Cấu hình OAuth Settings
Vào **Facebook Login > Settings**:

**Valid OAuth Redirect URIs:**
```
http://localhost:3000/auth/facebook/callback
http://localhost:3001/api/facebook/oauth/callback
https://yourdomain.com/api/facebook/oauth/callback
```

**Valid Origins:**
```
http://localhost:3000
http://localhost:3001
https://yourdomain.com
```

### 2.3 Thêm Webhooks (Optional)
1. Tìm "Webhooks" trong App Dashboard
2. Nhấp "Set up"
3. Cấu hình callback URL: `http://localhost:3001/api/facebook/webhooks`

## Bước 3: Permissions & Features

### 3.1 App Review > Permissions and Features
Yêu cầu các permissions sau:
- `pages_messaging` - Đọc và gửi tin nhắn
- `pages_read_engagement` - Đọc comments, reactions
- `pages_manage_metadata` - Quản lý thông tin trang
- `pages_read_user_content` - Đọc nội dung do người dùng tạo

### 3.2 Advanced Settings
Vào **Settings > Advanced**:
- Bật "Allow API Access to App Settings"
- Cấu hình "Valid Callback URLs"

## Bước 4: Lấy Credentials

Vào **Settings > Basic**:
```
App ID: 1234567890123456
App Secret: abcd1234efgh5678ijkl9012mnop3456
```

## Bước 5: Setup Environment Variables

### 5.1 Backend (.env)
```bash
# Facebook Configuration
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/facebook/oauth/callback
FACEBOOK_GRAPH_API_VERSION=v22.0
FACEBOOK_ENCRYPTION_KEY=generate-32-character-key-here
```

### 5.2 Frontend (.env.local)
```bash
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## Bước 6: Test Setup

### 6.1 Test Facebook Login
1. Chạy backend: `npm run start:dev`
2. Chạy frontend: `npm run dev`
3. Truy cập: http://localhost:3000/facebook/setup
4. Nhấp "Connect Facebook" để test

### 6.2 Verify Permissions
- Kiểm tra permissions được grant
- Test API calls to Facebook Graph API
- Verify webhook delivery (nếu đã setup)

## Bước 7: Development vs Production

### 7.1 Development Mode
- App ở chế độ "Development"
- Chỉ developers có thể truy cập
- Không cần App Review

### 7.2 Production Mode
- Cần submit App Review
- Cung cấp Privacy Policy URL
- Giải thích use case cho mỗi permission

## Troubleshooting

### Lỗi thường gặp:

1. **"App Not Setup"**
   - Kiểm tra App ID trong .env
   - Verify Facebook Login đã được setup

2. **"Invalid OAuth URI"**
   - Kiểm tra redirect URIs trong Facebook Login settings
   - Đảm bảo URL match exactly

3. **"Insufficient Permissions"**
   - Yêu cầu thêm permissions trong App Review
   - Test với test users trước

4. **CORS Issues**
   - Thêm domain vào Valid Origins
   - Cấu hình CORS trong backend

## Security Notes

1. **Never expose App Secret** trong frontend code
2. **Use HTTPS** trong production
3. **Validate** tất cả data từ Facebook API
4. **Encrypt** sensitive data trước khi lưu DB
5. **Rate limiting** cho API calls

## Useful Links

- Facebook Developers: https://developers.facebook.com/
- Graph API Explorer: https://developers.facebook.com/tools/explorer/
- App Review Guidelines: https://developers.facebook.com/docs/app-review/
- Webhooks Documentation: https://developers.facebook.com/docs/graph-api/webhooks/
