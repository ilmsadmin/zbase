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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("../auth/guards/permissions.guard");
const permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
let CustomersController = class CustomersController {
    customersService;
    constructor(customersService) {
        this.customersService = customersService;
    }
    findAll() {
        return this.customersService.findAll();
    }
    findOne(id) {
        return this.customersService.findOne(id);
    }
    create(createCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }
    update(id, updateCustomerDto) {
        return this.customersService.update(id, updateCustomerDto);
    }
    remove(id) {
        return this.customersService.remove(id);
    }
    getInvoices(id) {
        return this.customersService.getInvoices(id);
    }
    getDebt(id) {
        return this.customersService.getDebt(id);
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.RequirePermissions)('read:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách khách hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về danh sách khách hàng' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('read:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin khách hàng theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về thông tin khách hàng' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy khách hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.RequirePermissions)('create:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo khách hàng mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Khách hàng đã được tạo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('update:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin khách hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Khách hàng đã được cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy khách hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, permissions_decorator_1.RequirePermissions)('delete:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa khách hàng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Khách hàng đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy khách hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/invoices'),
    (0, permissions_decorator_1.RequirePermissions)('read:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Xem lịch sử mua hàng của khách' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về danh sách hóa đơn của khách' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy khách hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getInvoices", null);
__decorate([
    (0, common_1.Get)(':id/debt'),
    (0, permissions_decorator_1.RequirePermissions)('read:customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Xem công nợ của khách' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Trả về thông tin công nợ của khách' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy khách hàng' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "getDebt", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('customers'),
    (0, common_1.Controller)('customers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map