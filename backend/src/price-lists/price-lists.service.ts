import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreatePriceListDto, 
  UpdatePriceListDto, 
  AddPriceListItemDto, 
  UpdatePriceListItemDto 
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PriceListsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPriceListDto: CreatePriceListDto) {
    // Verify that the customer group exists
    const customerGroup = await this.prisma.customerGroup.findUnique({
      where: { id: createPriceListDto.customerGroupId },
    });

    if (!customerGroup) {
      throw new NotFoundException(`Customer group with ID ${createPriceListDto.customerGroupId} not found`);
    }

    // Check if code already exists
    const existingPriceList = await this.prisma.priceList.findUnique({
      where: { code: createPriceListDto.code },
    });

    if (existingPriceList) {
      throw new ConflictException(`Price list with code ${createPriceListDto.code} already exists`);
    }

    // Check if setting as default, and handle existing defaults if necessary
    if (createPriceListDto.isDefault) {
      await this.handleDefaultPriceList(createPriceListDto.customerGroupId);
    }

    return this.prisma.priceList.create({
      data: {
        name: createPriceListDto.name,
        code: createPriceListDto.code,
        description: createPriceListDto.description,
        customerGroupId: createPriceListDto.customerGroupId,
        startDate: createPriceListDto.startDate,
        endDate: createPriceListDto.endDate,
        priority: createPriceListDto.priority || 0,
        discountType: createPriceListDto.discountType || 'percentage',
        status: createPriceListDto.status || 'active',
        applicableOn: createPriceListDto.applicableOn || 'all',
        isDefault: createPriceListDto.isDefault || false,
        createdBy: createPriceListDto.createdBy,
      },
      include: {
        customerGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(
    search?: string,
    status?: string,
    customerGroupId?: number,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.PriceListWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (customerGroupId) {
      where.customerGroupId = customerGroupId;
    }

    const [items, total] = await Promise.all([
      this.prisma.priceList.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { startDate: 'desc' },
        ],
        include: {
          customerGroup: {
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
      }),
      this.prisma.priceList.count({ where }),
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
    const priceList = await this.prisma.priceList.findUnique({
      where: { id },
      include: {
        customerGroup: {
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
    });

    if (!priceList) {
      throw new NotFoundException(`Price list with ID ${id} not found`);
    }

    return priceList;
  }

  async update(id: number, updatePriceListDto: UpdatePriceListDto) {
    // Check if the price list exists
    await this.findOne(id);

    // Check if code is being changed and if it already exists
    if (updatePriceListDto.code) {
      const existingPriceList = await this.prisma.priceList.findFirst({
        where: {
          code: updatePriceListDto.code,
          id: { not: id },
        },
      });

      if (existingPriceList) {
        throw new ConflictException(`Price list with code ${updatePriceListDto.code} already exists`);
      }
    }

    // If customer group is being changed, validate it exists
    if (updatePriceListDto.customerGroupId) {
      const customerGroup = await this.prisma.customerGroup.findUnique({
        where: { id: updatePriceListDto.customerGroupId },
      });

      if (!customerGroup) {
        throw new NotFoundException(`Customer group with ID ${updatePriceListDto.customerGroupId} not found`);
      }
    }    // Check if setting as default, and handle existing defaults if necessary
    if (updatePriceListDto.isDefault === true) {
      const priceList = await this.prisma.priceList.findUnique({
        where: { id },
        select: { customerGroupId: true },
      });
        // Get the customer group ID to update (either from DTO or existing price list)
      const customerGroupId = updatePriceListDto.customerGroupId || priceList?.customerGroupId;
      // Only handle default logic if a customer group is specified
      if (customerGroupId !== undefined && customerGroupId !== null) {
        await this.handleDefaultPriceList(customerGroupId, id);
      }
    }

    return this.prisma.priceList.update({
      where: { id },
      data: updatePriceListDto,
      include: {
        customerGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    // Check if the price list exists
    await this.findOne(id);

    return this.prisma.priceList.delete({
      where: { id },
    });
  }

  async addPriceListItem(id: number, addPriceListItemDto: AddPriceListItemDto) {
    // Check if the price list exists
    const priceList = await this.findOne(id);

    // Check if the product exists
    const product = await this.prisma.product.findUnique({
      where: { id: addPriceListItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${addPriceListItemDto.productId} not found`);
    }

    // Check if the same product with the same min quantity already exists in this price list
    const existingItem = await this.prisma.priceListItem.findFirst({
      where: {
        priceListId: id,
        productId: addPriceListItemDto.productId,
        minQuantity: addPriceListItemDto.minQuantity || 1,
      },
    });

    if (existingItem) {
      throw new ConflictException(
        `Product with ID ${addPriceListItemDto.productId} and minimum quantity ${
          addPriceListItemDto.minQuantity || 1
        } already exists in this price list`,
      );
    }

    // Create the price list item
    return this.prisma.priceListItem.create({
      data: {
        priceListId: id,
        productId: addPriceListItemDto.productId,
        price: addPriceListItemDto.price,
        minQuantity: addPriceListItemDto.minQuantity || 1,
        maxQuantity: addPriceListItemDto.maxQuantity,
        discountType: addPriceListItemDto.discountType || 'percentage',
        discountValue: addPriceListItemDto.discountValue || 0,
        discountRate: addPriceListItemDto.discountRate || 0,
        specialConditions: addPriceListItemDto.specialConditions,      isActive: addPriceListItemDto.isActive ?? true,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
          },
        },
      },
    });
  }

  async findAllItems(id: number, page: number = 1, limit: number = 50) {
    // Check if the price list exists
    await this.findOne(id);

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.priceListItem.findMany({
        where: {
          priceListId: id,
        },
        skip,
        take: limit,
        orderBy: [
          { productId: 'asc' },
          { minQuantity: 'asc' },
        ],
        include: {
          product: {            select: {
              id: true,
              name: true,
              sku: true,
              price: true,
              unit: true,
            },
          },
        },
      }),
      this.prisma.priceListItem.count({
        where: {
          priceListId: id,
        },
      }),
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

  async updatePriceListItem(id: number, itemId: number, updatePriceListItemDto: UpdatePriceListItemDto) {
    // Check if the price list exists
    await this.findOne(id);

    // Check if the price list item exists
    const priceListItem = await this.prisma.priceListItem.findUnique({
      where: { id: itemId },
    });

    if (!priceListItem) {
      throw new NotFoundException(`Price list item with ID ${itemId} not found`);
    }

    if (priceListItem.priceListId !== id) {
      throw new BadRequestException(`Price list item with ID ${itemId} does not belong to price list with ID ${id}`);
    }

    // Check if min quantity is being changed and if it would create a duplicate
    if (updatePriceListItemDto.minQuantity !== undefined) {
      const existingItem = await this.prisma.priceListItem.findFirst({
        where: {
          priceListId: id,
          productId: priceListItem.productId,
          minQuantity: updatePriceListItemDto.minQuantity,
          id: { not: itemId },
        },
      });

      if (existingItem) {
        throw new ConflictException(
          `Another price list item with product ID ${priceListItem.productId} and minimum quantity ${updatePriceListItemDto.minQuantity} already exists`,
        );
      }
    }

    return this.prisma.priceListItem.update({
      where: { id: itemId },
      data: updatePriceListItemDto,
      include: {        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
          },
        },
      },
    });
  }

  async removePriceListItem(id: number, itemId: number) {
    // Check if the price list exists
    await this.findOne(id);

    // Check if the price list item exists and belongs to the specified price list
    const priceListItem = await this.prisma.priceListItem.findUnique({
      where: { id: itemId },
    });

    if (!priceListItem) {
      throw new NotFoundException(`Price list item with ID ${itemId} not found`);
    }

    if (priceListItem.priceListId !== id) {
      throw new BadRequestException(`Price list item with ID ${itemId} does not belong to price list with ID ${id}`);
    }

    return this.prisma.priceListItem.delete({
      where: { id: itemId },
    });
  }

  async setAsDefault(id: number) {
    // Check if the price list exists
    const priceList = await this.findOne(id);

    // Handle making this price list the default
    await this.handleDefaultPriceList(priceList.customerGroupId, id);

    return this.prisma.priceList.update({
      where: { id },
      data: {
        isDefault: true,
      },
      include: {
        customerGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getPriceListForCustomer(customerId: number) {
    // Find the customer and their group
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        group: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // If customer has no group, they have no price list
    if (!customer.group) {
      return null;
    }

    const today = new Date();    // Find the applicable price list for this customer group
    const priceLists = await this.prisma.priceList.findMany({
      where: {
        customerGroupId: customer.groupId || undefined,
        status: 'active',
        OR: [
          // No date restrictions
          {
            startDate: null,
            endDate: null,
          },
          // Only start date, must be in the past
          {
            startDate: { lte: today },
            endDate: null,
          },
          // Only end date, must be in the future
          {
            startDate: null,
            endDate: { gte: today },
          },
          // Both dates, must be within range
          {
            startDate: { lte: today },
            endDate: { gte: today },
          },
        ],
      },
      orderBy: [
        { isDefault: 'desc' },
        { priority: 'desc' },
      ],
      include: {
        items: {
          include: {              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  price: true,
                },
              },
          },
        },
      },
    });

    // Return the most appropriate price list (default with highest priority)
    return priceLists.length > 0 ? priceLists[0] : null;
  }

  // Helper method to handle default price list logic
  private async handleDefaultPriceList(customerGroupId: number, excludeId?: number) {
    // Reset isDefault flag for all other price lists in the same customer group
    await this.prisma.priceList.updateMany({
      where: {
        customerGroupId,
        isDefault: true,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      data: {
        isDefault: false,
      },
    });
  }
}
