"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const users_module_1 = require("../users/users.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const jwt_redis_strategy_1 = require("./strategies/jwt-redis.strategy");
const passport_1 = require("@nestjs/passport");
const redis_module_1 = require("../redis/redis.module");
const mongo_module_1 = require("../mongo/mongo.module");
const permissions_module_1 = require("../permissions/permissions.module");
const roles_module_1 = require("../roles/roles.module");
const roles_guard_1 = require("./guards/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            passport_1.PassportModule,
            redis_module_1.RedisModule,
            mongo_module_1.MongoModule,
            (0, common_1.forwardRef)(() => permissions_module_1.PermissionsModule),
            roles_module_1.RolesModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('app.jwtSecret'),
                    signOptions: {
                        expiresIn: configService.get('app.jwtExpiresIn', '1d'),
                    },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            jwt_redis_strategy_1.JwtRedisStrategy,
            roles_guard_1.RolesGuard
        ],
        exports: [auth_service_1.AuthService, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map