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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    findAll(query) {
        return this.productsService.findAll(query);
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    update(id, updateProductDto) {
        return this.productsService.update(id, updateProductDto);
    }
    remove(id) {
        return this.productsService.remove(id);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.POS),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo sản phẩm mới' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sản phẩm đã được tạo thành công.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Dữ liệu không hợp lệ.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.POS),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách sản phẩm' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Số trang' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Số lượng mỗi trang' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Từ khóa tìm kiếm' }),
    (0, swagger_1.ApiQuery)({ name: 'categoryId', required: false, description: 'Lọc theo danh mục' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Danh sách sản phẩm',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ProductQueryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.POS),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin sản phẩm theo ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của sản phẩm' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Thông tin sản phẩm',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy sản phẩm',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin sản phẩm' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của sản phẩm' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sản phẩm đã được cập nhật',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy sản phẩm',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa sản phẩm' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID của sản phẩm' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Sản phẩm đã được xóa',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Không tìm thấy sản phẩm',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Không thể xóa sản phẩm vì đang được sử dụng',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map