"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    options;
    client;
    constructor(options) {
        this.options = options;
    }
    onModuleInit() {
        this.client = new ioredis_1.default({
            host: this.options.host,
            port: this.options.port,
        });
    }
    onModuleDestroy() {
        if (this.client) {
            this.client.disconnect();
        }
    }
    getClient() {
        return this.client;
    }
    async set(key, value, ttl) {
        if (ttl) {
            await this.client.set(key, value, 'EX', ttl);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return this.client.get(key);
    }
    async del(key) {
        await this.client.del(key);
    }
    async keys(pattern) {
        return this.client.keys(pattern);
    }
    async setSession(userId, token, expiresIn) {
        const sessionData = JSON.stringify({
            token,
            expiresAt: Date.now() + expiresIn * 1000,
        });
        await this.set(`session:${userId}`, sessionData, expiresIn);
    }
    async getSession(userId) {
        const data = await this.get(`session:${userId}`);
        if (!data)
            return null;
        return JSON.parse(data);
    }
    async deleteSession(userId) {
        await this.del(`session:${userId}`);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS_OPTIONS')),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map