import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.APP_PORT || '3000', 10),
  host: process.env.APP_HOST || '0.0.0.0',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.APP_JWT_SECRET || 'super-secret',
  jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN || '86400',
  
  // Redis config
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),  
  
  // MongoDB config
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/zbase',
  
  // Features flags
  features: {
    facebook: process.env.ENABLE_FACEBOOK === 'true' || false
  },
  
  // Facebook config
  facebook: {
    appId: process.env.FACEBOOK_APP_ID, 
    appSecret: process.env.FACEBOOK_APP_SECRET, 
    callbackUrl: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/facebook/auth/callback',
    graphApiVersion: process.env.FACEBOOK_GRAPH_API_VERSION || 'v19.0',
    encryptionKey: process.env.FACEBOOK_ENCRYPTION_KEY || 'default-encryption-key-change-in-production',
  },
}));
