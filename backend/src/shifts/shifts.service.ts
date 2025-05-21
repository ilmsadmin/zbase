import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto, UpdateShiftDto, CloseShiftDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createShiftDto: CreateShiftDto, userId: number) {
    // Check if user already has an open shift
    const existingOpenShift = await this.prisma.shift.findFirst({
      where: {
        userId,
        status: 'open',
      },
    });

    if (existingOpenShift) {
      throw new BadRequestException('User already has an open shift');
    }

    // Verify warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createShiftDto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${createShiftDto.warehouseId} not found`);
    }

    // Create the shift
    return this.prisma.shift.create({
      data: {
        userId,
        warehouseId: createShiftDto.warehouseId,
        startTime: new Date(),
        startAmount: createShiftDto.startAmount,
        status: 'open',
        notes: createShiftDto.notes,
      },
      include: {
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
      },
    });
  }

  async findAll(
    status?: string,
    warehouseId?: number,
    userId?: number,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.ShiftWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (userId) {
      where.userId = userId;
    }

    const [items, total] = await Promise.all([
      this.prisma.shift.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startTime: 'desc',
        },
        include: {
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
        },
      }),
      this.prisma.shift.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: {
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
      },
    });

    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }

    return shift;
  }

  async findCurrentShift(userId: number) {
    const currentShift = await this.prisma.shift.findFirst({
      where: {
        userId,
        status: 'open',
      },
      include: {
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
      },
    });

    if (!currentShift) {
      return null; // No open shift for this user
    }

    return currentShift;
  }

  async update(id: number, updateShiftDto: UpdateShiftDto) {
    // Verify shift exists
    await this.findOne(id);

    return this.prisma.shift.update({
      where: { id },
      data: updateShiftDto,
      include: {
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
      },
    });
  }

  async closeShift(id: number, closeShiftDto: CloseShiftDto, userId: number) {
    // Verify shift exists
    const shift = await this.findOne(id);

    // Check if shift is already closed
    if (shift.status === 'closed') {
      throw new BadRequestException(`Shift is already closed`);
    }

    // Check if user owns this shift
    if (shift.userId !== userId) {
      throw new ForbiddenException(`You can only close your own shifts`);
    }

    // Close the shift
    return this.prisma.shift.update({
      where: { id },
      data: {
        status: 'closed',
        endTime: new Date(),
        endAmount: closeShiftDto.endAmount,
        notes: closeShiftDto.notes || shift.notes,
      },
      include: {
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
      },
    });
  }

  async getShiftSummary(id: number) {
    // Verify shift exists
    const shift = await this.findOne(id);

    // Get all invoices for this shift
    const invoices = await this.prisma.invoice.findMany({
      where: {
        shiftId: id,
      },
      select: {
        id: true,
        code: true,
        totalAmount: true,
        paidAmount: true,
        paymentMethod: true,
        status: true,
        createdAt: true,
      },
    });

    // Get all transactions for this shift
    const transactions = await this.prisma.transaction.findMany({
      where: {
        shiftId: id,
      },
      select: {
        id: true,
        code: true,
        transactionType: true,
        transactionMethod: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });

    // Calculate summary
    const totalSales = invoices.reduce(
      (sum, invoice) => sum + Number(invoice.totalAmount),
      0,
    );
    
    const totalReceived = transactions
      .filter(t => t.transactionType === 'receipt' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalPaid = transactions
      .filter(t => t.transactionType === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = Number(shift.startAmount) + totalReceived - totalPaid;
    const difference = shift.endAmount ? Number(shift.endAmount) - balance : 0;

    return {
      shift,
      invoices,
      transactions,
      summary: {
        totalSales,
        totalReceived,
        totalPaid,
        calculatedBalance: balance,
        declaredEndAmount: shift.endAmount || 0,
        difference,
      },
    };
  }
}
