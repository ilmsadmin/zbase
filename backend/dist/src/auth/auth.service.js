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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../redis/redis.service");
const pos_cache_service_1 = require("../redis/pos-cache.service");
const permissions_service_1 = require("../permissions/permissions.service");
const logs_service_1 = require("../mongo/logs.service");
const log_schema_1 = require("../mongo/schemas/log.schema");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    redisService;
    posCacheService;
    permissionsService;
    logsService;
    constructor(usersService, jwtService, configService, redisService, posCacheService, permissionsService, logsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.redisService = redisService;
        this.posCacheService = posCacheService;
        this.permissionsService = permissionsService;
        this.logsService = logsService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const roleNames = await this.usersService.getUserRoles(user.id);
        const payload = {
            email: user.email,
            sub: user.id,
            roles: roleNames
        };
        const jwtSecret = this.configService.get('app.jwtSecret');
        const expiresIn = parseInt(this.configService.get('app.jwtExpiresIn', '86400'), 10);
        const token = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn
        });
        await this.redisService.setSession(user.id, token, expiresIn);
        await this.posCacheService.storeJwtToken(user.id, token, expiresIn);
        await this.logsService.createLog({
            userId: user.id,
            action: log_schema_1.LogActionType.LOGIN,
            details: {
                ip: loginDto.ip || 'unknown',
                userAgent: loginDto.userAgent || 'unknown'
            }
        });
        const permissions = await this.permissionsService.getUserPermissions(user.id);
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                roles: roleNames,
                permissions,
            },
        };
    }
    async logout(userId) {
        await this.redisService.deleteSession(userId);
        await this.posCacheService.invalidateJwtToken(userId);
        await this.logsService.createLog({
            userId,
            action: log_schema_1.LogActionType.LOGOUT
        });
        return { success: true };
    }
    async getProfile(userId) {
        const user = await this.usersService.findOne(userId);
        const userRoles = await this.usersService.getUserRoles(userId);
        const permissions = await this.permissionsService.getUserPermissions(userId);
        return {
            ...user,
            roles: userRoles,
            permissions,
        };
    }
    async refreshToken(userId) {
        const user = await this.usersService.findOne(userId);
        const roleNames = await this.usersService.getUserRoles(userId);
        const payload = {
            email: user.email,
            sub: user.id,
            roles: roleNames
        };
        const jwtSecret = this.configService.get('app.jwtSecret');
        const expiresIn = parseInt(this.configService.get('app.jwtExpiresIn', '86400'), 10);
        const token = this.jwtService.sign(payload, {
            secret: jwtSecret,
            expiresIn
        });
        await this.redisService.setSession(user.id, token, expiresIn);
        await this.posCacheService.storeJwtToken(user.id, token, expiresIn);
        await this.logsService.createLog({
            userId,
            action: 'token_refresh'
        });
        return {
            access_token: token,
        };
    }
    decodeToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('app.jwtSecret'),
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => permissions_service_1.PermissionsService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        redis_service_1.RedisService,
        pos_cache_service_1.PosCacheService,
        permissions_service_1.PermissionsService,
        logs_service_1.LogsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map