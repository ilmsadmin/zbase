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
exports.JwtRedisStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const pos_cache_service_1 = require("../../redis/pos-cache.service");
const users_service_1 = require("../../users/users.service");
let JwtRedisStrategy = class JwtRedisStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-redis') {
    configService;
    posCacheService;
    usersService;
    constructor(configService, posCacheService, usersService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.jwtSecret'),
            passReqToCallback: true,
        });
        this.configService = configService;
        this.posCacheService = posCacheService;
        this.usersService = usersService;
    }
    async validate(request, payload) {
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        const cachedToken = await this.posCacheService.getJwtToken(payload.sub);
        if (!cachedToken || cachedToken !== token) {
            throw new common_1.UnauthorizedException('Invalid token or session expired');
        }
        const user = await this.usersService.findOne(payload.sub);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: payload.roles || [],
            permissions: payload.permissions || [],
        };
    }
};
exports.JwtRedisStrategy = JwtRedisStrategy;
exports.JwtRedisStrategy = JwtRedisStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        pos_cache_service_1.PosCacheService,
        users_service_1.UsersService])
], JwtRedisStrategy);
//# sourceMappingURL=jwt-redis.strategy.js.map