import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto, AddCustomerTransactionDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}  async create(createCustomerDto: CreateCustomerDto) {
    try {
      console.log('BACKEND SERVICE - Create Customer - Processing DTO:', JSON.stringify(createCustomerDto, null, 2));
      
      // Check if customer with same code already exists (if code provided)
      if (createCustomerDto.code) {
        const existingCustomer = await this.prisma.customer.findUnique({
          where: { code: createCustomerDto.code },
        });

        if (existingCustomer) {
          console.log('BACKEND SERVICE - Create Customer - Error: Code already exists');
          throw new BadRequestException(`Customer with code ${createCustomerDto.code} already exists`);
        }
      }

      // Check if customer group exists if groupId is provided
      if (createCustomerDto.groupId) {
        console.log('BACKEND SERVICE - Create Customer - Checking group ID:', createCustomerDto.groupId);
        
        const customerGroup = await this.prisma.customerGroup.findUnique({
          where: { id: createCustomerDto.groupId },
        });

        if (!customerGroup) {
          console.log('BACKEND SERVICE - Create Customer - Error: Group not found');
          throw new BadRequestException(`Customer group with ID ${createCustomerDto.groupId} not found`);
        }
      }

      console.log('BACKEND SERVICE - Create Customer - Creating with data:', JSON.stringify(createCustomerDto, null, 2));
      
      // Create the customer first without a code
      const result = await this.prisma.customer.create({
        data: createCustomerDto,
      });
      
      // Generate the KH-prefixed code using the customer's ID
      const customerCode = `KH${result.id.toString().padStart(4, '0')}`;
      console.log('BACKEND SERVICE - Create Customer - Generated code:', customerCode);
      
      // Update the customer with the generated code
      const updatedCustomer = await this.prisma.customer.update({
        where: { id: result.id },
        data: { code: customerCode },
      });
      
      console.log('BACKEND SERVICE - Create Customer - Success with generated code:', JSON.stringify(updatedCustomer, null, 2));
      return updatedCustomer;
    } catch (error) {
      console.error('BACKEND SERVICE - Create Customer - Error:', error);
      throw error;
    }
  }

  async findAll(
    groupId?: number,
    search?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.CustomerWhereInput = {};

    if (groupId) {
      where.groupId = groupId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          group: {
            select: {
              id: true,
              name: true,
              discountRate: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.customer.count({ where }),
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
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        group: true,
        invoices: {
          take: 10,
          orderBy: {
            invoiceDate: 'desc',
          },
          select: {
            id: true,
            code: true,
            invoiceDate: true,
            totalAmount: true,
            paidAmount: true,
            status: true,
          },
        },
        transactions: {
          take: 10,
          orderBy: {
            transactionDate: 'desc',
          },
          select: {
            id: true,
            code: true,
            transactionDate: true,
            amount: true,
            transactionType: true,
            status: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      console.log('BACKEND SERVICE - Update Customer - ID:', id);
      console.log('BACKEND SERVICE - Update Customer - Processing DTO:', JSON.stringify(updateCustomerDto, null, 2));
      
      // Check if customer exists
      const customer = await this.prisma.customer.findUnique({
        where: { id },
      });

      if (!customer) {
        console.log('BACKEND SERVICE - Update Customer - Error: Customer not found');
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }

      // Check if code is being changed and if the new code already exists
      if (updateCustomerDto.code && updateCustomerDto.code !== customer.code) {
        console.log('BACKEND SERVICE - Update Customer - Checking if new code exists:', updateCustomerDto.code);
        
        const existingCustomer = await this.prisma.customer.findUnique({
          where: { code: updateCustomerDto.code },
        });

        if (existingCustomer && existingCustomer.id !== id) {
          console.log('BACKEND SERVICE - Update Customer - Error: Code already exists');
          throw new BadRequestException(`Customer with code ${updateCustomerDto.code} already exists`);
        }
      }

      // Check if customer group exists if groupId is provided
      if (updateCustomerDto.groupId) {
        console.log('BACKEND SERVICE - Update Customer - Checking group ID:', updateCustomerDto.groupId);
        
        const customerGroup = await this.prisma.customerGroup.findUnique({
          where: { id: updateCustomerDto.groupId },
        });

        if (!customerGroup) {
          console.log('BACKEND SERVICE - Update Customer - Error: Group not found');
          throw new BadRequestException(`Customer group with ID ${updateCustomerDto.groupId} not found`);
        }
      }

      console.log('BACKEND SERVICE - Update Customer - Updating with data:', JSON.stringify(updateCustomerDto, null, 2));
      const result = await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
        include: {
          group: true,
        },
      });
      
      console.log('BACKEND SERVICE - Update Customer - Success:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('BACKEND SERVICE - Update Customer - Error:', error);
      throw error;
    }
  }

  async remove(id: number) {
    // Check if customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check if customer has related invoices
    const invoiceCount = await this.prisma.invoice.count({
      where: { customerId: id },
    });

    if (invoiceCount > 0) {
      throw new BadRequestException(`Cannot delete customer with ID ${id}: has ${invoiceCount} related invoices`);
    }

    // Check if customer has related transactions
    const transactionCount = await this.prisma.transaction.count({
      where: { customerId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestException(`Cannot delete customer with ID ${id}: has ${transactionCount} related transactions`);
    }

    // Check if customer has warranties
    const warrantyCount = await this.prisma.warranty.count({
      where: { customerId: id },
    });

    if (warrantyCount > 0) {
      throw new BadRequestException(`Cannot delete customer with ID ${id}: has ${warrantyCount} related warranty records`);
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getCustomerTransactions(
    customerId: number,
    startDate?: Date,
    endDate?: Date,
    type?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    // Check if customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    const skip = (page - 1) * limit;
    
    // Build where clause based on filters
    const where: Prisma.TransactionWhereInput = {
      customerId,
    };
    
    if (startDate || endDate) {
      where.transactionDate = {};
      
      if (startDate) {
        where.transactionDate.gte = startDate;
      }
      
      if (endDate) {
        where.transactionDate.lte = endDate;
      }
    }
    
    if (type) {
      where.transactionType = type;
    }

    // Get transactions with pagination
    const [items, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          transactionDate: 'desc',
        },
      }),
      this.prisma.transaction.count({ where }),
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
  async addCustomerTransaction(customerId: number, userId: number, addTransactionDto: AddCustomerTransactionDto) {
    // Check if customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Generate transaction code
    const transactionCount = await this.prisma.transaction.count();
    const transactionCode = `TRX-${new Date().getFullYear()}${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}${(transactionCount + 1).toString().padStart(4, '0')}`;
    
    // Map the transaction type from DTO to database type
    let transactionType: string;
    switch (addTransactionDto.type) {
      case 'PAYMENT':
        transactionType = 'receipt';
        break;
      case 'REFUND':
        transactionType = 'payment';
        break;
      case 'CREDIT_NOTE':
        transactionType = 'credit';
        break;
      case 'DEBIT_NOTE':
        transactionType = 'debit';
        break;
      default:
        transactionType = 'receipt';
    }    // Create the transaction
    const transaction = await this.prisma.transaction.create({
      data: {
        code: transactionCode,
        customerId,
        userId,
        transactionType,
        transactionMethod: 'manual',
        amount: new Prisma.Decimal(addTransactionDto.amount),
        transactionDate: new Date(),
        status: 'completed',
        referenceType: addTransactionDto.referenceType,
        referenceId: addTransactionDto.referenceId ? parseInt(addTransactionDto.referenceId) : null,
        notes: addTransactionDto.notes,
      },
    });    // Update customer balance was removed as creditBalance field no longer exists
    // This functionality would need to be reimplemented if balance tracking is needed

    return transaction;
  }
}
