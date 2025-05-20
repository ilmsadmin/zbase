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
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const log_schema_1 = require("./schemas/log.schema");
let LogsService = class LogsService {
    logModel;
    isMongoEnabled;
    constructor(logModel) {
        this.logModel = logModel;
        this.isMongoEnabled = !!this.logModel;
    }
    async createLog(logData) {
        if (!this.isMongoEnabled) {
            console.log(`[Logs] User ${logData.userId} performed action: ${logData.action}`, {
                resourceType: logData.resourceType,
                resourceId: logData.resourceId,
                details: logData.details || {}
            });
            return null;
        }
        return this.logModel.create({
            userId: logData.userId,
            action: logData.action,
            resourceType: logData.resourceType,
            resourceId: logData.resourceId,
            details: logData.details || {},
            ipAddress: logData.ipAddress,
            userMetadata: logData.userMetadata,
        });
    }
    async findLogs(options = {}) {
        if (!this.isMongoEnabled) {
            console.log('[Logs] Trying to find logs with query:', options);
            return [];
        }
        const query = {};
        if (options.userId) {
            query.userId = options.userId;
        }
        if (options.action) {
            if (Array.isArray(options.action)) {
                query.action = { $in: options.action };
            }
            else {
                query.action = options.action;
            }
        }
        if (options.resourceType) {
            if (Array.isArray(options.resourceType)) {
                query.resourceType = { $in: options.resourceType };
            }
            else {
                query.resourceType = options.resourceType;
            }
        }
        if (options.resourceId) {
            query.resourceId = options.resourceId;
        }
        if (options.startDate || options.endDate) {
            query.createdAt = {};
            if (options.startDate) {
                query.createdAt.$gte = options.startDate;
            }
            if (options.endDate) {
                query.createdAt.$lte = options.endDate;
            }
        }
        const sort = options.sort || { createdAt: -1 };
        const limit = options.limit || 100;
        const skip = options.skip || 0;
        return this.logModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .exec();
    }
    async findLogsByUserId(userId, options = {}) {
        return this.findLogs({ ...options, userId });
    }
    async findLogsByAction(action, options = {}) {
        return this.findLogs({ ...options, action });
    }
    async findLogsByResource(resourceType, resourceId, options = {}) {
        return this.findLogs({ ...options, resourceType, resourceId });
    }
    async findLogsByDateRange(startDate, endDate, options = {}) {
        return this.findLogs({ ...options, startDate, endDate });
    }
    async findInventoryLogs(warehouseId, productId, options = {}) {
        const query = {
            ...options,
            resourceType: log_schema_1.LogResourceType.INVENTORY,
            action: [log_schema_1.LogActionType.IMPORT_INVENTORY, log_schema_1.LogActionType.EXPORT_INVENTORY]
        };
        if (warehouseId || productId) {
            query.details = {};
        }
        return this.findLogs(query);
    }
    async findSalesLogs(options = {}) {
        return this.findLogs({
            ...options,
            action: log_schema_1.LogActionType.CREATE_SALE
        });
    }
    async findWarrantyLogs(options = {}) {
        return this.findLogs({
            ...options,
            resourceType: log_schema_1.LogResourceType.WARRANTY
        });
    }
};
exports.LogsService = LogsService;
exports.LogsService = LogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LogsService);
//# sourceMappingURL=logs.service.js.map