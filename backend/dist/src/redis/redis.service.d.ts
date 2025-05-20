import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
interface RedisOptions {
    host: string;
    port: number;
}
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private options;
    private client;
    constructor(options: RedisOptions);
    onModuleInit(): void;
    onModuleDestroy(): void;
    getClient(): Redis;
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    keys(pattern: string): Promise<string[]>;
    setSession(userId: number, token: string, expiresIn: number): Promise<void>;
    getSession(userId: number): Promise<{
        token: string;
        expiresAt: number;
    } | null>;
    deleteSession(userId: number): Promise<void>;
}
export {};
