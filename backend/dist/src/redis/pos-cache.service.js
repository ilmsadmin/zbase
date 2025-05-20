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
exports.PosCacheService = void 0;
const common_1 = require("@nestjs/common");
const redis_service_1 = require("./redis.service");
let PosCacheService = class PosCacheService {
    redisService;
    PRODUCT_KEY_PREFIX = 'product:';
    PRODUCTS_BY_WAREHOUSE_KEY_PREFIX = 'products:warehouse:';
    CATEGORY_KEY_PREFIX = 'category:';
    CATEGORIES_KEY = 'categories';
    JWT_KEY_PREFIX = 'jwt:';
    INVENTORY_KEY_PREFIX = 'inventory:';
    PRODUCT_TTL = 3600;
    CATEGORY_TTL = 7200;
    INVENTORY_TTL = 1800;
    JWT_TTL = 86400;
    constructor(redisService) {
        this.redisService = redisService;
    }
    async storeJwtToken(userId, token, expiresIn) {
        const key = `${this.JWT_KEY_PREFIX}${userId}`;
        await this.redisService.set(key, token, expiresIn);
    }
    async getJwtToken(userId) {
        const key = `${this.JWT_KEY_PREFIX}${userId}`;
        return this.redisService.get(key);
    }
    async invalidateJwtToken(userId) {
        const key = `${this.JWT_KEY_PREFIX}${userId}`;
        await this.redisService.del(key);
    }
    async cacheProduct(productId, productData, ttl) {
        const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
        await this.redisService.set(key, JSON.stringify(productData), ttl || this.PRODUCT_TTL);
    }
    async getProductFromCache(productId) {
        const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
        const data = await this.redisService.get(key);
        return data ? JSON.parse(data) : null;
    }
    async invalidateProductCache(productId) {
        const key = `${this.PRODUCT_KEY_PREFIX}${productId}`;
        await this.redisService.del(key);
        await this.invalidateAllWarehouseProducts();
    }
    async cacheWarehouseProducts(warehouseId, products, ttl) {
        const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
        await this.redisService.set(key, JSON.stringify(products), ttl || this.PRODUCT_TTL);
    }
    async getWarehouseProductsFromCache(warehouseId) {
        const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
        const data = await this.redisService.get(key);
        return data ? JSON.parse(data) : null;
    }
    async invalidateWarehouseProducts(warehouseId) {
        const key = `${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}${warehouseId}`;
        await this.redisService.del(key);
    }
    async invalidateAllWarehouseProducts() {
        const keys = await this.redisService.keys(`${this.PRODUCTS_BY_WAREHOUSE_KEY_PREFIX}*`);
        for (const key of keys) {
            await this.redisService.del(key);
        }
    }
    async cacheCategory(categoryId, categoryData, ttl) {
        const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
        await this.redisService.set(key, JSON.stringify(categoryData), ttl || this.CATEGORY_TTL);
        await this.invalidateCategoriesList();
    }
    async getCategoryFromCache(categoryId) {
        const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
        const data = await this.redisService.get(key);
        return data ? JSON.parse(data) : null;
    }
    async invalidateCategoryCache(categoryId) {
        const key = `${this.CATEGORY_KEY_PREFIX}${categoryId}`;
        await this.redisService.del(key);
        await this.invalidateCategoriesList();
    }
    async cacheCategoriesList(categories, ttl) {
        await this.redisService.set(this.CATEGORIES_KEY, JSON.stringify(categories), ttl || this.CATEGORY_TTL);
    }
    async getCategoriesListFromCache() {
        const data = await this.redisService.get(this.CATEGORIES_KEY);
        return data ? JSON.parse(data) : null;
    }
    async invalidateCategoriesList() {
        await this.redisService.del(this.CATEGORIES_KEY);
    }
    async cacheInventory(warehouseId, productId, inventoryData, ttl) {
        const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
        await this.redisService.set(key, JSON.stringify(inventoryData), ttl || this.INVENTORY_TTL);
    }
    async getInventoryFromCache(warehouseId, productId) {
        const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
        const data = await this.redisService.get(key);
        return data ? JSON.parse(data) : null;
    }
    async invalidateInventoryCache(warehouseId, productId) {
        const key = `${this.INVENTORY_KEY_PREFIX}${warehouseId}:${productId}`;
        await this.redisService.del(key);
    }
    async invalidateWarehouseInventory(warehouseId) {
        const keys = await this.redisService.keys(`${this.INVENTORY_KEY_PREFIX}${warehouseId}:*`);
        for (const key of keys) {
            await this.redisService.del(key);
        }
    }
    async handleProductUpdated(productId) {
        await this.invalidateProductCache(productId);
        await this.invalidateAllWarehouseProducts();
        await this.invalidateCategoriesList();
    }
    async handleInventoryUpdated(warehouseId, productId) {
        await this.invalidateInventoryCache(warehouseId, productId);
        await this.invalidateWarehouseProducts(warehouseId);
        await this.invalidateProductCache(productId);
    }
};
exports.PosCacheService = PosCacheService;
exports.PosCacheService = PosCacheService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], PosCacheService);
//# sourceMappingURL=pos-cache.service.js.map