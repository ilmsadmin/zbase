"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT || '3000', 10),
    host: process.env.APP_HOST || '0.0.0.0',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    jwtSecret: process.env.APP_JWT_SECRET || 'super-secret',
    jwtExpiresIn: process.env.APP_JWT_EXPIRES_IN || '86400',
    redisHost: process.env.REDIS_HOST || 'localhost',
    redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/zbase',
}));
//# sourceMappingURL=app.config.js.map