import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './dto';
import { Prisma } from '@prisma/client';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inventoryService: InventoryService,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { items, ...invoiceData } = createInvoiceDto;

    // Generate unique invoice code
    const invoiceCode = await this.generateInvoiceCode();
    
    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let totalAmount = 0;
    
    // Validate items and prepare them for creation
    const preparedItems = items.map(item => {
      const itemSubtotal = Number(item.quantity) * Number(item.unitPrice);
      const itemDiscount = Number(item.discountAmount || 0);
      const itemTax = Number(item.taxAmount || 0);
      const itemTotal = itemSubtotal - itemDiscount + itemTax;
      
      subtotal += itemSubtotal;
      taxAmount += itemTax;
      totalAmount += itemTotal;
      
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discountRate: item.discountRate || 0,
        discountAmount: item.discountAmount || 0,
        taxRate: item.taxRate || 0,
        taxAmount: item.taxAmount || 0,
        totalAmount: itemTotal,
        locationId: item.locationId,
        serialNumbers: item.serialNumbers,
        serialNumber: item.serialNumber,
        warrantyExpiration: item.warrantyExpiration,
        notes: item.notes,
      };
    });
    
    // Apply the total discount if provided
    const finalDiscountAmount = invoiceData.discountAmount || 0;
    totalAmount -= finalDiscountAmount;
    
    // Create the invoice with its items in a transaction
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Create the invoice
        const invoice = await prisma.invoice.create({
          data: {
            code: invoiceCode,
            customerId: invoiceData.customerId,
            userId: invoiceData.userId,
            shiftId: invoiceData.shiftId,
            warehouseId: invoiceData.warehouseId,
            invoiceDate: invoiceData.invoiceDate || new Date(),
            subtotal,
            taxAmount,
            discountAmount: finalDiscountAmount,
            totalAmount,
            paidAmount: invoiceData.paidAmount || 0,
            paymentMethod: invoiceData.paymentMethod,
            status: invoiceData.status || 'pending',
            notes: invoiceData.notes,
            items: {
              create: preparedItems,
            },
          },
          include: {
            items: true,
            customer: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            warehouse: true,
          },
        });
        
        // Update inventory for each item
        for (const item of invoice.items) {
          await this.inventoryService.decreaseStock(
            item.productId,
            invoice.warehouseId,
            item.locationId || null,
            Number(item.quantity),
            {
              referenceType: 'invoice',
              referenceId: invoice.id,
              userId: invoice.userId,
            }
          );
        }
        
        return invoice;
      });
      
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Duplicate invoice code');
        }
        if (error.code === 'P2003') {
          throw new BadRequestException('Referenced record does not exist');
        }
      }
      throw error;
    }
  }

  async findAll(
    customerId?: number,
    userId?: number,
    warehouseId?: number,
    status?: string,
    startDate?: Date,
    endDate?: Date,
    search?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.InvoiceWhereInput = {};

    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (status) where.status = status;
    
    // Add date range filter
    if (startDate || endDate) {
      where.invoiceDate = {};
      if (startDate) where.invoiceDate.gte = startDate;
      if (endDate) where.invoiceDate.lte = endDate;
    }

    // Add search filter
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { customer: { name: { contains: search, mode: 'insensitive' } } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: {
          invoiceDate: 'desc',
        },
      }),
      this.prisma.invoice.count({ where }),
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
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            location: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        warehouse: true,
        shift: true,
        transactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByCode(code: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { code },
      include: {
        items: {
          include: {
            product: true,
            location: true,
          },
        },
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        warehouse: true,
        shift: true,
        transactions: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with code ${code} not found`);
    }

    return invoice;
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // If invoice is already paid or canceled, don't allow updates
    if (invoice.status === 'paid' || invoice.status === 'canceled') {
      throw new BadRequestException(`Cannot update invoice with status ${invoice.status}`);
    }

    // Only allow updates to specific fields to avoid inconsistency
    const { notes, status, paidAmount, paymentMethod } = updateInvoiceDto;

    // Update only allowed fields
    return this.prisma.invoice.update({
      where: { id },
      data: {
        notes,
        status,
        paidAmount,
        paymentMethod,
        updatedAt: new Date(),
      },
      include: {
        items: true,
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async cancelInvoice(id: number, reason: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    // If invoice is already canceled, return it
    if (invoice.status === 'canceled') {
      return invoice;
    }

    // If invoice is paid, don't allow cancellation
    if (invoice.status === 'paid') {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    try {
      // Cancel the invoice and restore inventory in a transaction
      return await this.prisma.$transaction(async (prisma) => {
        // Update invoice status
        const updatedInvoice = await prisma.invoice.update({
          where: { id },
          data: {
            status: 'canceled',
            notes: invoice.notes 
              ? `${invoice.notes}\nCancellation reason: ${reason}`
              : `Cancellation reason: ${reason}`,
            updatedAt: new Date(),
          },
          include: {
            items: true,
            customer: true,
            warehouse: true,
          },
        });
        
        // Restore inventory for each item
        for (const item of invoice.items) {
          await this.inventoryService.increaseStock(
            item.productId,
            invoice.warehouseId,
            item.locationId || null,
            Number(item.quantity),
            {
              referenceType: 'invoice_cancel',
              referenceId: invoice.id,
              notes: `Restored due to invoice cancellation: ${reason}`,
            }
          );
        }
        
        return updatedInvoice;
      });
    } catch (error) {
      throw new BadRequestException(`Failed to cancel invoice: ${error.message}`);
    }
  }

  async remove(id: number) {
    // Invoices shouldn't be deleted, only canceled
    throw new BadRequestException('Invoices cannot be deleted, use cancel method instead');
  }

  private async generateInvoiceCode(): Promise<string> {
    const date = new Date();
    const prefix = `INV${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Get the last invoice with this prefix
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: {
        code: {
          startsWith: prefix,
        },
      },
      orderBy: {
        code: 'desc',
      },
    });

    let sequenceNumber = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.code.slice(prefix.length));
      sequenceNumber = isNaN(lastSequence) ? 1 : lastSequence + 1;
    }

    return `${prefix}${String(sequenceNumber).padStart(5, '0')}`;
  }
}
