import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto, FilterTransactionDto, TransactionType, UpdateTransactionDto } from './dto';
import { Transaction, Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate a unique transaction code
   */
  private async generateTransactionCode(type: TransactionType): Promise<string> {
    const prefix = type === TransactionType.RECEIPT ? 'REC' : 'PAY';
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    
    // Get count of today's transactions
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const count = await this.prisma.transaction.count({
      where: {
        transactionType: type,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
    
    // Format: REC/PAY-YYYYMMDD-XXXX (XXXX is a sequential number)
    return `${prefix}-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  /**
   * Create a new transaction
   */
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      // Generate code if not provided
      const code = createTransactionDto.code || 
        await this.generateTransactionCode(createTransactionDto.transactionType);

      // Verify related records exist
      if (createTransactionDto.customerId) {
        const customer = await this.prisma.customer.findUnique({
          where: { id: createTransactionDto.customerId },
        });
        if (!customer) {
          throw new BadRequestException(`Customer with ID ${createTransactionDto.customerId} not found`);
        }
      }

      if (createTransactionDto.partnerId) {
        const partner = await this.prisma.partner.findUnique({
          where: { id: createTransactionDto.partnerId },
        });
        if (!partner) {
          throw new BadRequestException(`Partner with ID ${createTransactionDto.partnerId} not found`);
        }
      }

      if (createTransactionDto.invoiceId) {
        const invoice = await this.prisma.invoice.findUnique({
          where: { id: createTransactionDto.invoiceId },
        });
        if (!invoice) {
          throw new BadRequestException(`Invoice with ID ${createTransactionDto.invoiceId} not found`);
        }
      }

      if (createTransactionDto.shiftId) {
        const shift = await this.prisma.shift.findUnique({
          where: { id: createTransactionDto.shiftId },
        });
        if (!shift) {
          throw new BadRequestException(`Shift with ID ${createTransactionDto.shiftId} not found`);
        }
      }

      // Create transaction with generated code
      return this.prisma.transaction.create({
        data: {
          ...createTransactionDto,
          code,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Transaction code must be unique');
        }
      }
      throw error;
    }
  }

  /**
   * Find all transactions with optional filtering
   */
  async findAll(filters: FilterTransactionDto = {}) {
    const {
      code,
      transactionType,
      status,
      category,
      startDate,
      endDate,
      customerId,
      partnerId,
      invoiceId,
      userId,
      shiftId,
    } = filters;

    const where: Prisma.TransactionWhereInput = {};

    if (code) where.code = { contains: code, mode: 'insensitive' };
    if (transactionType) where.transactionType = transactionType;
    if (status) where.status = status;
    if (category) where.category = category;
    
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = new Date(startDate);
      if (endDate) where.transactionDate.lte = new Date(endDate);
    }
    
    if (customerId) where.customerId = parseInt(customerId);
    if (partnerId) where.partnerId = parseInt(partnerId);
    if (invoiceId) where.invoiceId = parseInt(invoiceId);
    if (userId) where.userId = parseInt(userId);
    if (shiftId) where.shiftId = parseInt(shiftId);

    return this.prisma.transaction.findMany({
      where,
      include: {
        customer: true,
        partner: true,
        invoice: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shift: true,
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });
  }

  /**
   * Find a specific transaction by ID
   */
  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        customer: true,
        partner: true,
        invoice: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shift: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  /**
   * Find a specific transaction by code
   */
  async findByCode(code: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { code },
      include: {
        customer: true,
        partner: true,
        invoice: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shift: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with code ${code} not found`);
    }

    return transaction;
  }

  /**
   * Update a transaction by ID
   */
  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    await this.findOne(id);

    try {
      return await this.prisma.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Transaction code must be unique');
        }
      }
      throw error;
    }
  }

  /**
   * Remove a transaction by ID
   */
  async remove(id: number): Promise<Transaction> {
    await this.findOne(id);
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
