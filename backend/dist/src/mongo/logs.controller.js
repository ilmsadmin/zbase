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
exports.LogsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const logs_service_1 = require("./logs.service");
let LogsController = class LogsController {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    async findLogs(userId, action, resourceType, resourceId, startDate, endDate, limit, skip) {
        const options = {};
        if (userId) {
            options.userId = parseInt(userId, 10);
        }
        if (action) {
            options.action = action;
        }
        if (resourceType) {
            options.resourceType = resourceType;
        }
        if (resourceId) {
            options.resourceId = resourceId;
        }
        if (startDate) {
            options.startDate = new Date(startDate);
        }
        if (endDate) {
            options.endDate = new Date(endDate);
        }
        if (limit) {
            options.limit = parseInt(limit, 10);
        }
        if (skip) {
            options.skip = parseInt(skip, 10);
        }
        return this.logsService.findLogs(options);
    }
    async findInventoryLogs(warehouseId, productId, startDate, endDate, limit, skip) {
        const options = {};
        if (startDate) {
            options.startDate = new Date(startDate);
        }
        if (endDate) {
            options.endDate = new Date(endDate);
        }
        if (limit) {
            options.limit = parseInt(limit, 10);
        }
        if (skip) {
            options.skip = parseInt(skip, 10);
        }
        return this.logsService.findInventoryLogs(warehouseId, productId, options);
    }
    async findSalesLogs(startDate, endDate, userId, limit, skip) {
        const options = {};
        if (startDate) {
            options.startDate = new Date(startDate);
        }
        if (endDate) {
            options.endDate = new Date(endDate);
        }
        if (userId) {
            options.userId = parseInt(userId, 10);
        }
        if (limit) {
            options.limit = parseInt(limit, 10);
        }
        if (skip) {
            options.skip = parseInt(skip, 10);
        }
        return this.logsService.findSalesLogs(options);
    }
    async findWarrantyLogs(startDate, endDate, userId, limit, skip) {
        const options = {};
        if (startDate) {
            options.startDate = new Date(startDate);
        }
        if (endDate) {
            options.endDate = new Date(endDate);
        }
        if (userId) {
            options.userId = parseInt(userId, 10);
        }
        if (limit) {
            options.limit = parseInt(limit, 10);
        }
        if (skip) {
            options.skip = parseInt(skip, 10);
        }
        return this.logsService.findWarrantyLogs(options);
    }
    async findUserActivity(userId, startDate, endDate, limit, skip) {
        const options = {};
        if (startDate) {
            options.startDate = new Date(startDate);
        }
        if (endDate) {
            options.endDate = new Date(endDate);
        }
        if (limit) {
            options.limit = parseInt(limit, 10);
        }
        if (skip) {
            options.skip = parseInt(skip, 10);
        }
        return this.logsService.findLogsByUserId(userId, options);
    }
};
exports.LogsController = LogsController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('read:logs'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('action')),
    __param(2, (0, common_1.Query)('resourceType')),
    __param(3, (0, common_1.Query)('resourceId')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findLogs", null);
__decorate([
    (0, common_1.Get)('inventory'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:logs'),
    __param(0, (0, common_1.Query)('warehouseId')),
    __param(1, (0, common_1.Query)('productId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findInventoryLogs", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:logs'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findSalesLogs", null);
__decorate([
    (0, common_1.Get)('warranty'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:logs'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findWarrantyLogs", null);
__decorate([
    (0, common_1.Get)('user-activity'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:logs'),
    __param(0, (0, common_1.Query)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('skip')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "findUserActivity", null);
exports.LogsController = LogsController = __decorate([
    (0, common_1.Controller)('logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [logs_service_1.LogsService])
], LogsController);
//# sourceMappingURL=logs.controller.js.map