import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogsService } from '../mongo/logs.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private logsService: LogsService,
  ) {}

  async findAll() {
    return this.prisma.inventory.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  async findByWarehouse(warehouseId: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    return this.prisma.inventory.findMany({
      where: { warehouseId },
      include: {
        product: true,
      },
    });
  }

  async findByProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return this.prisma.inventory.findMany({
      where: { productId },
      include: {
        warehouse: true,
      },
    });
  }

  async importProducts(data: UpdateInventoryDto, userId: number) {
    const { warehouseId, productId, quantity } = data;

    // Validate warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    // Validate product
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Validate quantity
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Check if inventory record exists
      const inventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

      // Update inventory
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
      } else {
        // Create new inventory record
        await prisma.inventory.create({
          data: {
            productId,
            warehouseId,
            quantity,
          },
        });
      }

      // Create inventory transaction
      const transaction = await prisma.inventoryTransaction.create({
        data: {
          type: 'IMPORT',
          productId,
          warehouseId,
          quantity,
          employeeId: userId,
        },
      });

      // Log to MongoDB
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

  async exportProducts(data: UpdateInventoryDto, userId: number) {
    const { warehouseId, productId, quantity } = data;

    // Validate warehouse
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

    // Validate product
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Validate quantity
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      // Check if inventory record exists
      const inventory = await prisma.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

      // Check if there's enough inventory
      if (!inventory) {
        throw new BadRequestException(`Product with ID ${productId} not found in warehouse ${warehouseId}`);
      }

      if (inventory.quantity < quantity) {
        throw new BadRequestException(`Not enough inventory. Current: ${inventory.quantity}, Required: ${quantity}`);
      }

      // Update inventory
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

      // Create inventory transaction
      const transaction = await prisma.inventoryTransaction.create({
        data: {
          type: 'EXPORT',
          productId,
          warehouseId,
          quantity,
          employeeId: userId,
        },
      });

      // Log to MongoDB
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

  async getInventoryTransactions(warehouseId?: number, productId?: number) {
    const where: any = {};

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

  async checkLowStock(threshold: number = 5) {
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
}
