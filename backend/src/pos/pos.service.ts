// filepath: d:\www\zbase\backend\src\pos\pos.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateQuickSaleDto, InventoryCheckDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly shiftsService: ShiftsService,
  ) {}

  async checkActiveShift(userId: number) {
    const shift = await this.shiftsService.findCurrentShift(userId);
    
    if (!shift) {
      return {
        hasActiveShift: false,
        message: 'No active shift found for the user',
      };
    }

    return {
      hasActiveShift: true,
      shiftData: shift,
    };
  }

  async createQuickSale(createQuickSaleDto: CreateQuickSaleDto, userId: number) {
    // Check if user has an active shift
    const activeShift = await this.shiftsService.findCurrentShift(userId);
    
    if (!activeShift) {
      throw new BadRequestException('User does not have an active shift');
    }

    // Get warehouse from the active shift
    const warehouseId = activeShift.warehouseId;

    // Validate customer if provided
    if (createQuickSaleDto.customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: createQuickSaleDto.customerId },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${createQuickSaleDto.customerId} not found`);
      }
    }
    
    // Calculate invoice totals
    let subtotal = 0;
    let taxAmount = 0;
    const processedItems: {
      productId: number;
      quantity: number;
      unitPrice: any;
      taxRate: any;
      taxAmount: number;
      discountRate: number;
      discountAmount: number;
      totalAmount: number;
      locationId: number | null;
    }[] = [];

    // Process each item in the sale
    for (const item of createQuickSaleDto.items) {
      // Validate product
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      // Check inventory availability
      const inventory = await this.prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          warehouseId,
          quantity: {
            gte: item.quantity,
          },
        },
      });

      if (!inventory) {
        throw new BadRequestException(`Insufficient inventory for product ID ${item.productId}`);
      }

      // Calculate item totals
      const unitPrice = item.unitPrice || product.basePrice;
      const itemTaxAmount = Number(unitPrice) * Number(item.quantity) * (Number(product.taxRate) / 100);
      const itemSubtotal = Number(unitPrice) * Number(item.quantity);
      const itemTotal = itemSubtotal + itemTaxAmount;

      subtotal += itemSubtotal;
      taxAmount += itemTaxAmount;

      processedItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        taxRate: product.taxRate,
        taxAmount: itemTaxAmount,
        discountRate: 0,
        discountAmount: 0,
        totalAmount: itemTotal,
        locationId: inventory.locationId,
      });
    }

    const totalAmount = subtotal + taxAmount - (createQuickSaleDto.discountAmount || 0);

    // Generate invoice code
    const invoiceCount = await this.prisma.invoice.count();
    const invoiceCode = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}${(invoiceCount + 1).toString().padStart(4, '0')}`;

    // Create invoice with items
    const invoice = await this.prisma.invoice.create({
      data: {
        code: invoiceCode,
        customerId: createQuickSaleDto.customerId,
        userId,
        shiftId: activeShift.id,
        warehouseId,
        subtotal,
        taxAmount,
        discountAmount: createQuickSaleDto.discountAmount || 0,
        totalAmount,
        paidAmount: createQuickSaleDto.paidAmount || 0,
        paymentMethod: createQuickSaleDto.paymentMethod || 'cash',
        status: (createQuickSaleDto.paidAmount ?? 0) >= totalAmount ? 'paid' : 'pending',
        notes: createQuickSaleDto.notes,
        items: {
          create: processedItems,
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    // Update inventory for each item
    for (const item of processedItems) {
      await this.prisma.inventory.updateMany({
        where: {
          productId: item.productId,
          warehouseId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      // Record the inventory transaction
      await this.prisma.inventoryTransaction.create({
        data: {
          productId: item.productId,
          warehouseId,
          locationId: item.locationId,
          transactionType: 'out',
          quantity: item.quantity,
          referenceType: 'invoice',
          referenceId: invoice.id,
          userId,
          notes: `POS quick sale for invoice ${invoice.code}`,
        },
      });
    }
    
    // If payment is made, create a transaction record
    if ((createQuickSaleDto.paidAmount ?? 0) > 0) {
      const transactionCount = await this.prisma.transaction.count();
      const transactionCode = `TRX-${new Date().getFullYear()}${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}${(transactionCount + 1).toString().padStart(4, '0')}`;

      await this.prisma.transaction.create({
        data: {
          code: transactionCode,
          transactionType: 'receipt',
          transactionMethod: createQuickSaleDto.paymentMethod || 'cash',
          amount: new Prisma.Decimal(createQuickSaleDto.paidAmount ?? 0),
          customerId: createQuickSaleDto.customerId,
          invoiceId: invoice.id,
          referenceType: 'invoice',
          referenceId: invoice.id,
          userId,
          shiftId: activeShift.id,
          paymentMethod: createQuickSaleDto.paymentMethod || 'cash',
          notes: `Payment for invoice ${invoice.code}`,
        },
      });
    }

    return invoice;
  }

  async checkInventory(inventoryCheckDto: InventoryCheckDto, userId: number) {
    // Check if user has an active shift
    const activeShift = await this.shiftsService.findCurrentShift(userId);
    
    if (!activeShift) {
      throw new BadRequestException('User does not have an active shift');
    }

    const warehouseId = activeShift.warehouseId;

    // Get warehouse details
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: warehouseId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${warehouseId} not found`);
    }

  // Check each item's inventory
    const inventoryItems: Array<{
      productId: number;
      product: any;
      requestedQuantity: number;
      availableQuantity: number | Prisma.Decimal;
      isAvailable: boolean | null;
      location: any;
    }> = [];
    let allItemsAvailable = true;

    for (const item of inventoryCheckDto.items) {
      // Get product details
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          code: true,
          basePrice: true,
          unit: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      // Check inventory
      const inventory = await this.prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          warehouseId,
        },        include: {
          location: true,
        },
      });
      
      const available = inventory && Number(inventory.quantity) >= Number(item.quantity);
      const currentQty = inventory ? inventory.quantity : 0;

      if (!available) {
        allItemsAvailable = false;
      }

      inventoryItems.push({
        productId: item.productId,
        product,
        requestedQuantity: item.quantity,
        availableQuantity: currentQty,
        isAvailable: available,
        location: inventory?.location || null,
      });
    }

    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      items: inventoryItems,
      allItemsAvailable,
    };
  }

  async getDashboardData(userId: number) {
    // Check if user has an active shift
    const activeShift = await this.shiftsService.findCurrentShift(userId);
    
    if (!activeShift) {
      throw new BadRequestException('User does not have an active shift');
    }

    const shiftId = activeShift.id;
    const warehouseId = activeShift.warehouseId;

    // Get total sales for active shift
    const salesStats = await this.prisma.$queryRaw`
      SELECT 
        COALESCE(SUM("totalAmount"), 0) as "totalSales",
        COUNT(*) as "totalInvoices",
        SUM(CASE WHEN "status" = 'pending' THEN 1 ELSE 0 END) as "pendingInvoices"
      FROM "Invoice"
      WHERE "shiftId" = ${shiftId}
    `;

    // Get transaction totals by payment method
    const cashTransactions = await this.prisma.transaction.aggregate({
      where: {
        shiftId,
        transactionMethod: 'cash',
      },
      _sum: {
        amount: true,
      },
    });

    const cardTransactions = await this.prisma.transaction.aggregate({
      where: {
        shiftId,
        transactionMethod: 'card',
      },      _sum: {
        amount: true,
      },
    });
    
    // Format results
    const stats = (salesStats as any[])[0];
    
    return {
      shiftId,
      warehouseId,
      userId,
      totalSales: Number(stats?.totalSales || 0),
      totalInvoices: Number(stats?.totalInvoices || 0),
      pendingInvoices: Number(stats?.pendingInvoices || 0),
      cashReceived: Number(cashTransactions._sum.amount || 0),
      cardReceived: Number(cardTransactions._sum.amount || 0),
    };
  }

  async getRecentSales(userId: number, page: number = 1, limit: number = 10) {
    // Check if user has an active shift
    const activeShift = await this.shiftsService.findCurrentShift(userId);
    
    if (!activeShift) {
      throw new BadRequestException('User does not have an active shift');
    }

    const shiftId = activeShift.id;
    const skip = (page - 1) * limit;

    // Get invoices for active shift
    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          shiftId,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              totalAmount: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.invoice.count({
        where: {
          shiftId,
        },
      }),
    ]);

    return {
      items: invoices,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchProducts(query: string, warehouseId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Build where clause based on search query
    const where: Prisma.ProductWhereInput = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
        { barcode: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Get products with inventory data for the warehouse
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          barcode: true,
          basePrice: true,
          unit: true,
          taxRate: true,
          inventory: {
            where: {
              warehouseId,
            },
            select: {
              quantity: true,
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
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    // Transform products to include inventory data directly
    const transformedProducts = products.map((product) => {
      const inventoryItem = product.inventory[0];
      return {
        ...product,
        availableQuantity: inventoryItem ? inventoryItem.quantity : 0,
        location: inventoryItem ? inventoryItem.location : null,
        inventory: undefined, // Remove the original inventory array
      };
    });

    return {
      items: transformedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async searchCustomers(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Build where clause based on search query
    const where: Prisma.CustomerWhereInput = {};

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
        select: {
          id: true,
          code: true,
          name: true,
          phone: true,
          email: true,
          address: true,
          group: {
            select: {
              id: true,
              name: true,
              discountRate: true,
            },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      items: customers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
