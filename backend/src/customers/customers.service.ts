import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if customer with same code already exists (if code provided)
    if (createCustomerDto.code) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { code: createCustomerDto.code },
      });

      if (existingCustomer) {
        throw new BadRequestException(`Customer with code ${createCustomerDto.code} already exists`);
      }
    }

    // Check if customer group exists if groupId is provided
    if (createCustomerDto.groupId) {
      const customerGroup = await this.prisma.customerGroup.findUnique({
        where: { id: createCustomerDto.groupId },
      });

      if (!customerGroup) {
        throw new BadRequestException(`Customer group with ID ${createCustomerDto.groupId} not found`);
      }
    }

    return this.prisma.customer.create({
      data: createCustomerDto,
    });
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
    // Check if customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check if code is being changed and if the new code already exists
    if (updateCustomerDto.code && updateCustomerDto.code !== customer.code) {
      const existingCustomer = await this.prisma.customer.findUnique({
        where: { code: updateCustomerDto.code },
      });

      if (existingCustomer && existingCustomer.id !== id) {
        throw new BadRequestException(`Customer with code ${updateCustomerDto.code} already exists`);
      }
    }

    // Check if customer group exists if groupId is provided
    if (updateCustomerDto.groupId) {
      const customerGroup = await this.prisma.customerGroup.findUnique({
        where: { id: updateCustomerDto.groupId },
      });

      if (!customerGroup) {
        throw new BadRequestException(`Customer group with ID ${updateCustomerDto.groupId} not found`);
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        group: true,
      },
    });
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
}
