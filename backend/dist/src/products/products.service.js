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
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pos_cache_service_1 = require("../redis/pos-cache.service");
let ProductsService = ProductsService_1 = class ProductsService {
    prisma;
    cacheService;
    logger = new common_1.Logger(ProductsService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async create(createProductDto) {
        try {
            const existingProduct = await this.prisma.product.findUnique({
                where: { code: createProductDto.code },
            });
            if (existingProduct) {
                throw new common_1.ConflictException(`Sản phẩm với mã ${createProductDto.code} đã tồn tại`);
            }
            const product = await this.prisma.product.create({
                data: {
                    code: createProductDto.code,
                    name: createProductDto.name,
                    price: createProductDto.price.toString(),
                    categoryId: createProductDto.categoryId,
                    attributes: createProductDto.attributes || {},
                },
                include: {
                    category: true,
                },
            });
            await this.invalidateCache();
            return product;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error creating product: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll(query) {
        try {
            const { page = 1, limit = 10, search, categoryId, sortBy = 'createdAt', sortOrder = 'desc' } = query;
            const skip = (page - 1) * limit;
            const cacheKey = `products:list:${page}:${limit}:${search || ''}:${categoryId || ''}:${sortBy}:${sortOrder}`;
            const cachedData = await this.cacheService.get(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            const where = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { code: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (categoryId) {
                where.categoryId = parseInt(categoryId, 10);
            }
            const orderBy = {};
            orderBy[sortBy] = sortOrder;
            const [products, total] = await Promise.all([
                this.prisma.product.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy,
                    include: {
                        category: true,
                    },
                }),
                this.prisma.product.count({ where }),
            ]);
            const result = {
                data: products,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            };
            await this.cacheService.set(cacheKey, JSON.stringify(result), 600);
            return result;
        }
        catch (error) {
            this.logger.error(`Error finding products: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const cacheKey = `products:${id}`;
            const cachedProduct = await this.cacheService.get(cacheKey);
            if (cachedProduct) {
                return JSON.parse(cachedProduct);
            }
            const product = await this.prisma.product.findUnique({
                where: { id },
                include: {
                    category: true,
                },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Sản phẩm với ID ${id} không tồn tại`);
            }
            await this.cacheService.set(cacheKey, JSON.stringify(product), 3600);
            return product;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding product: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateProductDto) {
        try {
            await this.findOne(id);
            if (updateProductDto.code) {
                const existingProduct = await this.prisma.product.findFirst({
                    where: {
                        code: updateProductDto.code,
                        id: { not: id },
                    },
                });
                if (existingProduct) {
                    throw new common_1.ConflictException(`Mã sản phẩm ${updateProductDto.code} đã được sử dụng bởi sản phẩm khác`);
                }
            }
            const product = await this.prisma.product.update({
                where: { id },
                data: {
                    ...(updateProductDto.code && { code: updateProductDto.code }),
                    ...(updateProductDto.name && { name: updateProductDto.name }),
                    ...(updateProductDto.price && { price: updateProductDto.price.toString() }),
                    ...(updateProductDto.categoryId !== undefined && { categoryId: updateProductDto.categoryId }),
                    ...(updateProductDto.attributes && { attributes: updateProductDto.attributes }),
                },
                include: {
                    category: true,
                },
            });
            await this.cacheService.del(`products:${id}`);
            await this.invalidateCache();
            return product;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error updating product: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            const inventoryCount = await this.prisma.inventory.count({
                where: { productId: id },
            });
            if (inventoryCount > 0) {
                throw new common_1.ConflictException(`Không thể xóa sản phẩm vì có ${inventoryCount} bản ghi tồn kho đang sử dụng sản phẩm này`);
            }
            const invoiceDetailsCount = await this.prisma.invoiceDetail.count({
                where: { productId: id },
            });
            if (invoiceDetailsCount > 0) {
                throw new common_1.ConflictException(`Không thể xóa sản phẩm vì có ${invoiceDetailsCount} hóa đơn đang sử dụng sản phẩm này`);
            }
            await this.prisma.product.delete({
                where: { id },
            });
            await this.cacheService.del(`products:${id}`);
            await this.invalidateCache();
            return { message: `Đã xóa sản phẩm với ID ${id}` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error deleting product: ${error.message}`, error.stack);
            throw error;
        }
    }
    async invalidateCache() {
        try {
            await this.cacheService.delByPattern('products:list:*');
            this.logger.log('Product cache invalidated');
        }
        catch (error) {
            this.logger.error(`Error invalidating product cache: ${error.message}`, error.stack);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pos_cache_service_1.PosCacheService])
], ProductsService);
//# sourceMappingURL=products.service.js.map