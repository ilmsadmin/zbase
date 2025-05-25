# Facebook App Configuration Template

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# ========================================
# FACEBOOK APP CONFIGURATION
# ========================================

# Facebook App Credentials (từ Meta Developers Console)
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here

# OAuth Callback URL (phải match với Facebook App settings)
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/facebook/oauth/callback

# Graph API Configuration
FACEBOOK_GRAPH_API_VERSION=v18.0
FACEBOOK_GRAPH_API_BASE_URL=https://graph.facebook.com

# Token Security
FACEBOOK_TOKEN_ENCRYPTION_KEY=your_32_character_encryption_key

# Rate Limiting
FACEBOOK_API_RATE_LIMIT=200
FACEBOOK_API_RATE_WINDOW=3600

# Webhook Configuration (for real-time updates)
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
FACEBOOK_WEBHOOK_SECRET=your_webhook_app_secret
```

## 🏗️ Facebook App Setup Checklist

### 1. Create Facebook App
- [ ] Go to [Meta Developers Console](https://developers.facebook.com/)
- [ ] Create new app of type "Business"
- [ ] Note down App ID and App Secret

### 2. Configure App Permissions
**Required permissions**:
- [ ] `pages_show_list` - View pages list
- [ ] `pages_read_engagement` - Read page interactions  
- [ ] `pages_manage_metadata` - Manage page info
- [ ] `pages_messaging` - Send/receive messages
- [ ] `pages_manage_posts` - Manage posts and comments
- [ ] `public_profile` - Basic user profile

### 3. Configure OAuth Settings
- [ ] Add OAuth Redirect URI: `https://yourdomain.com/api/facebook/oauth/callback`
- [ ] Add domain to App Domains
- [ ] Configure Valid OAuth Redirect URIs

### 4. Set up Webhooks (Optional - for real-time updates)
- [ ] Add webhook endpoint: `https://yourdomain.com/api/facebook/webhooks`
- [ ] Subscribe to: `messages`, `messaging_postbacks`, `feed`
- [ ] Configure Verify Token

### 5. App Review & Go Live
- [ ] Submit for App Review nếu cần advanced permissions
- [ ] Switch to Live mode khi ready for production

## 🔐 Security Considerations

### Token Encryption
Facebook access tokens sẽ được encrypt trước khi lưu database:
```typescript
// Example configuration trong facebook.config.ts
export const facebookConfig = {
  encryption: {
    algorithm: 'aes-256-gcm',
    key: process.env.FACEBOOK_TOKEN_ENCRYPTION_KEY,
  }
}
```

### Webhook Verification
```typescript
// Verify webhook signatures
const crypto = require('crypto');

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
  
  return `sha256=${expectedSignature}` === signature;
}
```

## 📝 Development vs Production

### Development Setup
```env
FACEBOOK_APP_ID=your_dev_app_id
FACEBOOK_CALLBACK_URL=http://localhost:3001/api/facebook/oauth/callback
```

### Production Setup  
```env
FACEBOOK_APP_ID=your_prod_app_id
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/facebook/oauth/callback
```

## 🔍 Testing Accounts

Facebook cho phép tạo test accounts:
- [ ] Create test users trong App Dashboard
- [ ] Test OAuth flow với test accounts
- [ ] Test permissions và API calls

## 📚 References

- [Facebook Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/business-login)
- [Page Access Tokens](https://developers.facebook.com/docs/pages/access-tokens)
- [Webhooks for Pages](https://developers.facebook.com/docs/graph-api/webhooks/reference/page)
