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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const require_permissions_decorator_1 = require("../auth/decorators/require-permissions.decorator");
const update_inventory_dto_1 = require("./dto/update-inventory.dto");
let InventoryController = class InventoryController {
    inventoryService;
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    findAll() {
        return this.inventoryService.findAll();
    }
    findByWarehouse(warehouseId) {
        return this.inventoryService.findByWarehouse(warehouseId);
    }
    findByProduct(productId) {
        return this.inventoryService.findByProduct(productId);
    }
    importProducts(updateInventoryDto, req) {
        return this.inventoryService.importProducts(updateInventoryDto, req.user.userId);
    }
    exportProducts(updateInventoryDto, req) {
        return this.inventoryService.exportProducts(updateInventoryDto, req.user.userId);
    }
    getTransactions(warehouseId, productId) {
        return this.inventoryService.getInventoryTransactions(warehouseId ? parseInt(warehouseId) : undefined, productId ? parseInt(productId) : undefined);
    }
    checkLowStock(threshold) {
        return this.inventoryService.checkLowStock(threshold ? parseInt(threshold) : 5);
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)('read:inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('warehouse/:warehouseId'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:inventory'),
    __param(0, (0, common_1.Param)('warehouseId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findByWarehouse", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:inventory'),
    __param(0, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "findByProduct", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, require_permissions_decorator_1.RequirePermissions)('import:inventory'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_inventory_dto_1.UpdateInventoryDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "importProducts", null);
__decorate([
    (0, common_1.Post)('export'),
    (0, require_permissions_decorator_1.RequirePermissions)('export:inventory'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_inventory_dto_1.UpdateInventoryDto, Object]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "exportProducts", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:inventory'),
    __param(0, (0, common_1.Query)('warehouseId')),
    __param(1, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('low-stock'),
    (0, require_permissions_decorator_1.RequirePermissions)('read:inventory'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventoryController.prototype, "checkLowStock", null);
exports.InventoryController = InventoryController = __decorate([
    (0, common_1.Controller)('inventory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map