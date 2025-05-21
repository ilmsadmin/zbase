import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryDto, UpdateInventoryDto, CreateInventoryTransactionDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventoryDto: CreateInventoryDto) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: createInventoryDto.productId },
    });
    
    if (!product) {
      throw new BadRequestException(`Product with ID ${createInventoryDto.productId} not found`);
    }

    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createInventoryDto.warehouseId },
    });
    
    if (!warehouse) {
      throw new BadRequestException(`Warehouse with ID ${createInventoryDto.warehouseId} not found`);
    }

    // Verify location exists if locationId is provided
    if (createInventoryDto.locationId) {
      const location = await this.prisma.warehouseLocation.findUnique({
        where: { id: createInventoryDto.locationId },
      });
      
      if (!location) {
        throw new BadRequestException(`Location with ID ${createInventoryDto.locationId} not found`);
      }

      // Check if location belongs to the specified warehouse
      if (location.warehouseId !== createInventoryDto.warehouseId) {
        throw new BadRequestException('Location does not belong to the specified warehouse');
      }
    }

    // Check if inventory record already exists for this product/warehouse/location combination
    const existingInventory = await this.prisma.inventory.findFirst({
      where: {
        productId: createInventoryDto.productId,
        warehouseId: createInventoryDto.warehouseId,
        locationId: createInventoryDto.locationId,
      },
    });

    if (existingInventory) {
      throw new BadRequestException('Inventory record already exists for this product/warehouse/location combination');
    }

    // Create inventory record
    return this.prisma.inventory.create({
      data: createInventoryDto,
    });
  }

  async findAll(
    warehouseId?: number,
    productId?: number,
    locationId?: number,
    lowStock?: boolean,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    
    // Build the where clause based on the provided filters
    const where: Prisma.InventoryWhereInput = {};
    
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    
    if (productId) {
      where.productId = productId;
    }
    
    if (locationId) {
      where.locationId = locationId;
    }    if (lowStock) {
      // Compare to minStockLevel with a subquery approach - will need updating based on exact schema
      where.quantity = {
        lte: 10, // Replace with appropriate low stock threshold or parameter
      };
    }

    // Get inventory items with pagination
    const [items, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
              unit: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              id: true,
              zone: true,
              aisle: true,
              rack: true,
              shelf: true,
              position: true,
            },
          },
        },
        orderBy: {
          productId: 'asc',
        },
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        location: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory record with ID ${id} not found`);
    }

    return inventory;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    // Check if inventory exists
    const existingInventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!existingInventory) {
      throw new NotFoundException(`Inventory record with ID ${id} not found`);
    }

    // Check if locationId, warehouseId or productId has changed
    if (
      (updateInventoryDto.productId && updateInventoryDto.productId !== existingInventory.productId) ||
      (updateInventoryDto.warehouseId && updateInventoryDto.warehouseId !== existingInventory.warehouseId) ||
      (updateInventoryDto.locationId !== undefined && updateInventoryDto.locationId !== existingInventory.locationId)
    ) {
      // Check if there is already an inventory record with the new combination
      const duplicateInventory = await this.prisma.inventory.findFirst({
        where: {
          productId: updateInventoryDto.productId || existingInventory.productId,
          warehouseId: updateInventoryDto.warehouseId || existingInventory.warehouseId,
          locationId: updateInventoryDto.locationId,
          id: { not: id }, // Exclude current record
        },
      });

      if (duplicateInventory) {
        throw new BadRequestException('Another inventory record already exists with this product/warehouse/location combination');
      }
    }

    // Validate relations if they are being updated
    if (updateInventoryDto.productId) {
      const product = await this.prisma.product.findUnique({
        where: { id: updateInventoryDto.productId },
      });
      
      if (!product) {
        throw new BadRequestException(`Product with ID ${updateInventoryDto.productId} not found`);
      }
    }

    if (updateInventoryDto.warehouseId) {
      const warehouse = await this.prisma.warehouse.findUnique({
        where: { id: updateInventoryDto.warehouseId },
      });
      
      if (!warehouse) {
        throw new BadRequestException(`Warehouse with ID ${updateInventoryDto.warehouseId} not found`);
      }
    }

    if (updateInventoryDto.locationId) {
      const location = await this.prisma.warehouseLocation.findUnique({
        where: { id: updateInventoryDto.locationId },
      });
      
      if (!location) {
        throw new BadRequestException(`Location with ID ${updateInventoryDto.locationId} not found`);
      }

      // Check if location belongs to the correct warehouse
      const warehouseId = updateInventoryDto.warehouseId || existingInventory.warehouseId;
      
      if (location.warehouseId !== warehouseId) {
        throw new BadRequestException('Location does not belong to the specified warehouse');
      }
    }

    return this.prisma.inventory.update({
      where: { id },
      data: updateInventoryDto,
      include: {
        product: true,
        warehouse: true,
        location: true,
      },
    });
  }

  async remove(id: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory record with ID ${id} not found`);
    }

    return this.prisma.inventory.delete({
      where: { id },
    });
  }

  // Transaction-related methods
  async createTransaction(createInventoryTransactionDto: CreateInventoryTransactionDto) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: createInventoryTransactionDto.productId },
    });
    
    if (!product) {
      throw new BadRequestException(`Product with ID ${createInventoryTransactionDto.productId} not found`);
    }

    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createInventoryTransactionDto.warehouseId },
    });
    
    if (!warehouse) {
      throw new BadRequestException(`Warehouse with ID ${createInventoryTransactionDto.warehouseId} not found`);
    }

    // Verify location exists if locationId is provided
    if (createInventoryTransactionDto.locationId) {
      const location = await this.prisma.warehouseLocation.findUnique({
        where: { id: createInventoryTransactionDto.locationId },
      });
      
      if (!location) {
        throw new BadRequestException(`Location with ID ${createInventoryTransactionDto.locationId} not found`);
      }

      // Check if location belongs to the specified warehouse
      if (location.warehouseId !== createInventoryTransactionDto.warehouseId) {
        throw new BadRequestException('Location does not belong to the specified warehouse');
      }
    }

    // Validate transaction type
    const validTransactionTypes = ['in', 'out', 'transfer', 'adjustment'];
    if (!validTransactionTypes.includes(createInventoryTransactionDto.transactionType)) {
      throw new BadRequestException(`Invalid transaction type: ${createInventoryTransactionDto.transactionType}`);
    }

    return this.prisma.$transaction(async (prisma) => {
      // Create inventory transaction record
      const transaction = await prisma.inventoryTransaction.create({
        data: createInventoryTransactionDto,
      });

      // Update inventory quantity based on transaction type
      const inventoryRecord = await prisma.inventory.findFirst({
        where: {
          productId: createInventoryTransactionDto.productId,
          warehouseId: createInventoryTransactionDto.warehouseId,
          locationId: createInventoryTransactionDto.locationId,
        },
      });

      if (!inventoryRecord) {
        // If inventory record doesn't exist and it's an 'in' transaction, create it
        if (createInventoryTransactionDto.transactionType === 'in') {
          await prisma.inventory.create({
            data: {
              productId: createInventoryTransactionDto.productId,
              warehouseId: createInventoryTransactionDto.warehouseId,
              locationId: createInventoryTransactionDto.locationId,
              quantity: createInventoryTransactionDto.quantity,
              minStockLevel: 0,
            },
          });
        } else {
          throw new BadRequestException('Cannot perform transaction: no inventory record exists for this product/warehouse/location');
        }
      } else {
        // Update existing inventory record based on transaction type
        let newQuantity: number;
        
        switch (createInventoryTransactionDto.transactionType) {
          case 'in':
            newQuantity = Number(inventoryRecord.quantity) + Number(createInventoryTransactionDto.quantity);
            break;
          case 'out':
            newQuantity = Number(inventoryRecord.quantity) - Number(createInventoryTransactionDto.quantity);
            if (newQuantity < 0) {
              throw new BadRequestException('Insufficient stock for transaction');
            }
            break;
          case 'adjustment':
            newQuantity = Number(createInventoryTransactionDto.quantity);
            break;
          default:
            newQuantity = Number(inventoryRecord.quantity);
        }

        await prisma.inventory.update({
          where: { id: inventoryRecord.id },
          data: { quantity: newQuantity },
        });
      }

      return transaction;
    });
  }

  async getTransactions(
    productId?: number, 
    warehouseId?: number,
    locationId?: number,
    transactionType?: string,
    startDate?: Date,
    endDate?: Date,
    page: number = 1, 
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    
    // Build where clause based on filters
    const where: Prisma.InventoryTransactionWhereInput = {};
    
    if (productId) {
      where.productId = productId;
    }
    
    if (warehouseId) {
      where.warehouseId = warehouseId;
    }
    
    if (locationId) {
      where.locationId = locationId;
    }
    
    if (transactionType) {
      where.transactionType = transactionType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    // Get transactions with pagination
    const [items, total] = await Promise.all([
      this.prisma.inventoryTransaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
            select: {
              id: true,
              code: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          location: {
            select: {
              id: true,
              zone: true,
              aisle: true,
              rack: true,
              shelf: true,
              position: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.inventoryTransaction.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: number) {
    const transaction = await this.prisma.inventoryTransaction.findUnique({
      where: { id },
      include: {
        product: true,
        warehouse: true,
        location: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Inventory transaction with ID ${id} not found`);
    }

    return transaction;
  }
}
