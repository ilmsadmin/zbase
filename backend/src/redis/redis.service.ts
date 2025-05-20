import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

interface RedisOptions {
  host: string;
  port: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(
    @Inject('REDIS_OPTIONS') private options: RedisOptions,
  ) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.options.host,
      port: this.options.port,
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async setSession(userId: number, token: string, expiresIn: number): Promise<void> {
    const sessionData = JSON.stringify({
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    });
    await this.set(`session:${userId}`, sessionData, expiresIn);
  }

  async getSession(userId: number): Promise<{ token: string; expiresAt: number } | null> {
    const data = await this.get(`session:${userId}`);
    if (!data) return null;
    return JSON.parse(data);
  }

  async deleteSession(userId: number): Promise<void> {
    await this.del(`session:${userId}`);
  }
}
