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
exports.WarehouseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const warehouse_service_1 = require("./warehouse.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let WarehouseController = class WarehouseController {
    warehouseService;
    constructor(warehouseService) {
        this.warehouseService = warehouseService;
    }
    findAll() {
        return this.warehouseService.findAll();
    }
    findOne(id) {
        return this.warehouseService.findOne(id);
    }
    create(createWarehouseDto) {
        return this.warehouseService.create(createWarehouseDto);
    }
    update(id, updateWarehouseDto) {
        return this.warehouseService.update(id, updateWarehouseDto);
    }
    remove(id) {
        return this.warehouseService.remove(id);
    }
};
exports.WarehouseController = WarehouseController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('read:warehouse'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách kho hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về danh sách kho hàng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('read:warehouse'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin kho hàng theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về thông tin kho hàng' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy kho hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('create:warehouse'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo kho hàng mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kho hàng đã được tạo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateWarehouseDto]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('update:warehouse'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin kho hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kho hàng đã được cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy kho hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateWarehouseDto]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('delete:warehouse'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa kho hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kho hàng đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy kho hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WarehouseController.prototype, "remove", null);
exports.WarehouseController = WarehouseController = __decorate([
    (0, swagger_1.ApiTags)('warehouses'),
    (0, common_1.Controller)('warehouses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [warehouse_service_1.WarehouseService])
], WarehouseController);
//# sourceMappingURL=warehouse.controller.js.map