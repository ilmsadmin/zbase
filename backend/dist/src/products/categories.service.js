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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pos_cache_service_1 = require("../redis/pos-cache.service");
let CategoriesService = CategoriesService_1 = class CategoriesService {
    prisma;
    cacheService;
    logger = new common_1.Logger(CategoriesService_1.name);
    constructor(prisma, cacheService) {
        this.prisma = prisma;
        this.cacheService = cacheService;
    }
    async create(createCategoryDto) {
        try {
            const existingCategory = await this.prisma.category.findFirst({
                where: {
                    name: {
                        equals: createCategoryDto.name,
                        mode: 'insensitive',
                    },
                },
            });
            if (existingCategory) {
                throw new common_1.ConflictException(`Danh mục '${createCategoryDto.name}' đã tồn tại`);
            }
            const category = await this.prisma.category.create({
                data: createCategoryDto,
            });
            await this.invalidateCache();
            return category;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error creating category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll() {
        try {
            const cacheKey = 'categories:all';
            const cachedCategories = await this.cacheService.get(cacheKey);
            if (cachedCategories) {
                return JSON.parse(cachedCategories);
            }
            const categories = await this.prisma.category.findMany({
                include: {
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            });
            const transformedCategories = categories.map(category => ({
                ...category,
                productCount: category._count.products,
                _count: undefined,
            }));
            await this.cacheService.set(cacheKey, JSON.stringify(transformedCategories), 3600);
            return transformedCategories;
        }
        catch (error) {
            this.logger.error(`Error finding categories: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const cacheKey = `categories:${id}`;
            const cachedCategory = await this.cacheService.get(cacheKey);
            if (cachedCategory) {
                return JSON.parse(cachedCategory);
            }
            const category = await this.prisma.category.findUnique({
                where: { id },
                include: {
                    products: {
                        take: 10,
                    },
                    _count: {
                        select: {
                            products: true,
                        },
                    },
                },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Danh mục với ID ${id} không tồn tại`);
            }
            const transformedCategory = {
                ...category,
                productCount: category._count.products,
                _count: undefined,
            };
            await this.cacheService.set(cacheKey, JSON.stringify(transformedCategory), 3600);
            return transformedCategory;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error finding category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateCategoryDto) {
        try {
            await this.findOne(id);
            if (updateCategoryDto.name) {
                const existingCategory = await this.prisma.category.findFirst({
                    where: {
                        name: {
                            equals: updateCategoryDto.name,
                            mode: 'insensitive',
                        },
                        id: { not: id },
                    },
                });
                if (existingCategory) {
                    throw new common_1.ConflictException(`Danh mục '${updateCategoryDto.name}' đã tồn tại`);
                }
            }
            const category = await this.prisma.category.update({
                where: { id },
                data: updateCategoryDto,
            });
            await this.cacheService.del(`categories:${id}`);
            await this.invalidateCache();
            return category;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error updating category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            const productCount = await this.prisma.product.count({
                where: { categoryId: id },
            });
            if (productCount > 0) {
                throw new common_1.ConflictException(`Không thể xóa danh mục vì có ${productCount} sản phẩm đang thuộc danh mục này`);
            }
            await this.prisma.category.delete({
                where: { id },
            });
            await this.cacheService.del(`categories:${id}`);
            await this.invalidateCache();
            return { message: `Đã xóa danh mục với ID ${id}` };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.ConflictException) {
                throw error;
            }
            this.logger.error(`Error deleting category: ${error.message}`, error.stack);
            throw error;
        }
    }
    async invalidateCache() {
        try {
            await this.cacheService.del('categories:all');
            this.logger.log('Category cache invalidated');
        }
        catch (error) {
            this.logger.error(`Error invalidating category cache: ${error.message}`, error.stack);
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        pos_cache_service_1.PosCacheService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map