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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const logs_service_1 = require("../mongo/logs.service");
let InventoryService = class InventoryService {
    prisma;
    logsService;
    constructor(prisma, logsService) {
        this.prisma = prisma;
        this.logsService = logsService;
    }
    async findAll() {
        return this.prisma.inventory.findMany({
            include: {
                product: true,
                warehouse: true,
            },
        });
    }
    async findByWarehouse(warehouseId) {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse with ID ${warehouseId} not found`);
        }
        return this.prisma.inventory.findMany({
            where: { warehouseId },
            include: {
                product: true,
            },
        });
    }
    async findByProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        return this.prisma.inventory.findMany({
            where: { productId },
            include: {
                warehouse: true,
            },
        });
    }
    async importProducts(data, userId) {
        const { warehouseId, productId, quantity } = data;
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse with ID ${warehouseId} not found`);
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        return this.prisma.$transaction(async (prisma) => {
            const inventory = await prisma.inventory.findUnique({
                where: {
                    productId_warehouseId: {
                        productId,
                        warehouseId,
                    },
                },
            });
            if (inventory) {
                await prisma.inventory.update({
                    where: {
                        productId_warehouseId: {
                            productId,
                            warehouseId,
                        },
                    },
                    data: {
                        quantity: {
                            increment: quantity,
                        },
                        lastUpdated: new Date(),
                    },
                });
            }
            else {
                await prisma.inventory.create({
                    data: {
                        productId,
                        warehouseId,
                        quantity,
                    },
                });
            }
            const transaction = await prisma.inventoryTransaction.create({
                data: {
                    type: 'IMPORT',
                    productId,
                    warehouseId,
                    quantity,
                    employeeId: userId,
                },
            });
            await this.logsService.createLog({
                userId,
                action: 'import_inventory',
                details: {
                    productId,
                    productName: product.name,
                    warehouseId,
                    warehouseName: warehouse.name,
                    quantity,
                    transactionId: transaction.id,
                },
            });
            return transaction;
        });
    }
    async exportProducts(data, userId) {
        const { warehouseId, productId, quantity } = data;
        const warehouse = await this.prisma.warehouse.findUnique({
            where: { id: warehouseId },
        });
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse with ID ${warehouseId} not found`);
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        if (quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        return this.prisma.$transaction(async (prisma) => {
            const inventory = await prisma.inventory.findUnique({
                where: {
                    productId_warehouseId: {
                        productId,
                        warehouseId,
                    },
                },
            });
            if (!inventory) {
                throw new common_1.BadRequestException(`Product with ID ${productId} not found in warehouse ${warehouseId}`);
            }
            if (inventory.quantity < quantity) {
                throw new common_1.BadRequestException(`Not enough inventory. Current: ${inventory.quantity}, Required: ${quantity}`);
            }
            await prisma.inventory.update({
                where: {
                    productId_warehouseId: {
                        productId,
                        warehouseId,
                    },
                },
                data: {
                    quantity: {
                        decrement: quantity,
                    },
                    lastUpdated: new Date(),
                },
            });
            const transaction = await prisma.inventoryTransaction.create({
                data: {
                    type: 'EXPORT',
                    productId,
                    warehouseId,
                    quantity,
                    employeeId: userId,
                },
            });
            await this.logsService.createLog({
                userId,
                action: 'export_inventory',
                details: {
                    productId,
                    productName: product.name,
                    warehouseId,
                    warehouseName: warehouse.name,
                    quantity,
                    transactionId: transaction.id,
                },
            });
            return transaction;
        });
    }
    async getInventoryTransactions(warehouseId, productId) {
        const where = {};
        if (warehouseId) {
            where.warehouseId = warehouseId;
        }
        if (productId) {
            where.productId = productId;
        }
        return this.prisma.inventoryTransaction.findMany({
            where,
            include: {
                product: true,
                warehouse: true,
                employee: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async checkLowStock(threshold = 5) {
        return this.prisma.inventory.findMany({
            where: {
                quantity: {
                    lte: threshold,
                },
            },
            include: {
                product: true,
                warehouse: true,
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        logs_service_1.LogsService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map