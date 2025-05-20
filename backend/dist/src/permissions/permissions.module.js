"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("./permissions.service");
const prisma_module_1 = require("../prisma/prisma.module");
const redis_module_1 = require("../redis/redis.module");
const permissions_controller_1 = require("./permissions.controller");
const actions_discovery_service_1 = require("./actions-discovery.service");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("../auth/auth.module");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, redis_module_1.RedisModule, core_1.DiscoveryModule, (0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [
            permissions_service_1.PermissionsService,
            actions_discovery_service_1.ActionsDiscoveryService,
            core_1.MetadataScanner
        ],
        exports: [permissions_service_1.PermissionsService, actions_discovery_service_1.ActionsDiscoveryService],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map