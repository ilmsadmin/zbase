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
exports.CreateWarehouseDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateWarehouseDto {
    name;
    address;
    managerId;
}
exports.CreateWarehouseDto = CreateWarehouseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tên kho hàng',
        example: 'Kho Hàng Chính',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên kho không được để trống' }),
    (0, class_validator_1.MinLength)(2, { message: 'Tên kho phải có ít nhất 2 ký tự' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Tên kho không được vượt quá 100 ký tự' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim()),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Địa chỉ kho hàng',
        example: '123 Đường ABC, Quận XYZ, TP HCM',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => o.address !== null && o.address !== ''),
    (0, class_validator_1.MaxLength)(250, { message: 'Địa chỉ không được vượt quá 250 ký tự' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.trim() || null),
    __metadata("design:type", String)
], CreateWarehouseDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID của người quản lý kho',
        example: 1,
        required: false,
    }),
    (0, class_validator_1.IsInt)({ message: 'ID người quản lý phải là số nguyên' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateWarehouseDto.prototype, "managerId", void 0);
//# sourceMappingURL=create-warehouse.dto.js.map