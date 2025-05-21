import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerGroupDto, UpdateCustomerGroupDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerGroupDto: CreateCustomerGroupDto) {
    // Check if customer group with the same name already exists
    const existingGroup = await this.prisma.customerGroup.findFirst({
      where: { name: createCustomerGroupDto.name },
    });

    if (existingGroup) {
      throw new BadRequestException(`Customer group with name "${createCustomerGroupDto.name}" already exists`);
    }

    return this.prisma.customerGroup.create({
      data: createCustomerGroupDto,
    });
  }
  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    return this.prisma.customerGroup.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const customerGroup = await this.prisma.customerGroup.findUnique({
      where: { id },
      include: {
        customers: {
          take: 10,
          select: {
            id: true,
            name: true,
            code: true,
            phone: true,
            email: true,
            creditBalance: true,
          },
        },
        priceLists: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
            isDefault: true,
          },
        },
        _count: {
          select: { customers: true },
        },
      },
    });

    if (!customerGroup) {
      throw new NotFoundException(`Customer group with ID ${id} not found`);
    }

    return customerGroup;
  }

  async update(id: number, updateCustomerGroupDto: UpdateCustomerGroupDto) {
    // Check if customer group exists
    const customerGroup = await this.prisma.customerGroup.findUnique({
      where: { id },
    });

    if (!customerGroup) {
      throw new NotFoundException(`Customer group with ID ${id} not found`);
    }

    // Check if name is being updated and if the new name already exists
    if (updateCustomerGroupDto.name && updateCustomerGroupDto.name !== customerGroup.name) {
      const existingGroup = await this.prisma.customerGroup.findFirst({
        where: { name: updateCustomerGroupDto.name },
      });

      if (existingGroup && existingGroup.id !== id) {
        throw new BadRequestException(`Customer group with name "${updateCustomerGroupDto.name}" already exists`);
      }
    }

    return this.prisma.customerGroup.update({
      where: { id },
      data: updateCustomerGroupDto,
    });
  }

  async remove(id: number) {
    // Check if customer group exists
    const customerGroup = await this.prisma.customerGroup.findUnique({
      where: { id },
    });

    if (!customerGroup) {
      throw new NotFoundException(`Customer group with ID ${id} not found`);
    }

    // Check if customer group has customers
    const customerCount = await this.prisma.customer.count({
      where: { groupId: id },
    });

    if (customerCount > 0) {
      throw new BadRequestException(`Cannot delete customer group: ${customerCount} customers are assigned to this group`);
    }

    // Check if customer group has price lists
    const priceListCount = await this.prisma.priceList.count({
      where: { customerGroupId: id },
    });

    if (priceListCount > 0) {
      throw new BadRequestException(`Cannot delete customer group: ${priceListCount} price lists are assigned to this group`);
    }

    return this.prisma.customerGroup.delete({
      where: { id },
    });
  }
}
