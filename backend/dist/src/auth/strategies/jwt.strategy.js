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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const redis_service_1 = require("../../redis/redis.service");
const permissions_service_1 = require("../../permissions/permissions.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    prisma;
    redis;
    permissions;
    constructor(configService, prisma, redis, permissions) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.jwtSecret') || 'fallback-secret',
        });
        this.configService = configService;
        this.prisma = prisma;
        this.redis = redis;
        this.permissions = permissions;
    }
    async validate(payload) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const session = await this.redis.getSession(user.id);
        if (!session) {
            throw new common_1.UnauthorizedException('Session expired or invalid');
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: { userId: user.id },
            include: { role: true },
        });
        const roleNames = userRoles.map(ur => ur.role.name);
        const permissions = await this.permissions.getUserPermissions(user.id);
        const { password, ...userData } = user;
        return {
            ...userData,
            roles: roleNames,
            permissions,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        permissions_service_1.PermissionsService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map