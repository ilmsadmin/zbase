import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class SessionCacheService {
  // Key prefixes
  private readonly SESSION_KEY_PREFIX = 'session:';
  private readonly USER_PERM_KEY_PREFIX = 'user:permissions:';
  
  // TTL values in seconds
  private readonly SESSION_TTL = 86400; // 24 hours
  private readonly PERM_TTL = 3600; // 1 hour

  constructor(private readonly redisService: RedisService) {}

  // Session caching
  async cacheSession(sessionId: string, userId: number, metadata: object, ttl?: number): Promise<void> {
    const key = `${this.SESSION_KEY_PREFIX}${sessionId}`;
    const sessionData = {
      userId,
      metadata,
      createdAt: Date.now(),
    };
    await this.redisService.set(key, JSON.stringify(sessionData), ttl || this.SESSION_TTL);
  }

  async getSession(sessionId: string): Promise<any | null> {
    const key = `${this.SESSION_KEY_PREFIX}${sessionId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async updateSessionTTL(sessionId: string, ttl: number): Promise<void> {
    const key = `${this.SESSION_KEY_PREFIX}${sessionId}`;
    const data = await this.redisService.get(key);
    if (data) {
      await this.redisService.set(key, data, ttl);
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `${this.SESSION_KEY_PREFIX}${sessionId}`;
    await this.redisService.del(key);
  }

  async deleteAllUserSessions(userId: number): Promise<void> {
    const pattern = `${this.SESSION_KEY_PREFIX}*`;
    const keys = await this.redisService.keys(pattern);
    
    for (const key of keys) {
      const data = await this.redisService.get(key);
      if (data) {
        const sessionData = JSON.parse(data);
        if (sessionData.userId === userId) {
          await this.redisService.del(key);
        }
      }
    }
  }

  // User permissions caching
  async cacheUserPermissions(userId: number, permissions: string[], ttl?: number): Promise<void> {
    const key = `${this.USER_PERM_KEY_PREFIX}${userId}`;
    await this.redisService.set(key, JSON.stringify(permissions), ttl || this.PERM_TTL);
  }

  async getUserPermissions(userId: number): Promise<string[] | null> {
    const key = `${this.USER_PERM_KEY_PREFIX}${userId}`;
    const data = await this.redisService.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async invalidateUserPermissions(userId: number): Promise<void> {
    const key = `${this.USER_PERM_KEY_PREFIX}${userId}`;
    await this.redisService.del(key);
  }
}
