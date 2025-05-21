import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Prisma } from '@prisma/client';
import { ProductAttributesService } from '../product-attributes/product-attributes.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productAttributesService: ProductAttributesService
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Check if product with same code already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { code: createProductDto.code },
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with code ${createProductDto.code} already exists`);
    }

    // Check if category exists when categoryId is provided
    if (createProductDto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: createProductDto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Category with ID ${createProductDto.categoryId} not found`);
      }
    }    // Extract attributes from DTO
    const { attributes, ...productData } = createProductDto;

    // Use transaction to create product and attributes
    return this.prisma.$transaction(async (prisma) => {
      // Create product
      const product = await prisma.product.create({
        data: productData,
      });

      // Create attributes if provided
      if (attributes && attributes.length > 0) {
        await this.productAttributesService.bulkCreate(
          attributes.map(attr => ({
            productId: product.id,
            attributeName: attr.attributeName,
            attributeValue: attr.attributeValue,
          }))
        );
      }

      // Return product with attributes
      return this.findOne(product.id);
    });
  }

  async findAll(
    categoryId?: number, 
    search?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;
    
    const where: Prisma.ProductWhereInput = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          attributes: true,
          _count: {
            select: {
              inventory: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);
    
    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        attributes: true,
        inventory: {
          include: {
            warehouse: true,
            location: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Check if product exists
    await this.findOne(id);
    
    // Check if code is being changed and if new code already exists
    if (updateProductDto.code) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { 
          code: updateProductDto.code,
          id: { not: id },
        },
      });
      
      if (existingProduct) {
        throw new BadRequestException(`Product with code ${updateProductDto.code} already exists`);
      }
    }

    // Check if category exists when categoryId is provided
    if (updateProductDto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: updateProductDto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Category with ID ${updateProductDto.categoryId} not found`);
      }
    }

    // Extract attributes from DTO
    const { attributes, ...productData } = updateProductDto;

    // Use transaction to update product and attributes
    return this.prisma.$transaction(async (prisma) => {
      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: productData,
      });

      // Update attributes if provided
      if (attributes && attributes.length > 0) {
        // Delete existing attributes
        await prisma.productAttribute.deleteMany({
          where: { productId: id },
        });
        
        // Create new attributes
        await prisma.productAttribute.createMany({
          data: attributes.map(attr => ({
            productId: id,
            attributeName: attr.attributeName,
            attributeValue: attr.attributeValue,
          })),
        });
      }

      // Return updated product with attributes
      return this.findOne(id);
    });
  }

  async remove(id: number) {
    // Check if product exists
    await this.findOne(id);
    
    // Check if product has inventory
    const inventoryCount = await this.prisma.inventory.count({
      where: { productId: id },
    });
    
    if (inventoryCount > 0) {
      throw new BadRequestException('Cannot delete product with inventory records');
    }
    
    // Check if product has invoice items
    const invoiceItemCount = await this.prisma.invoiceItem.count({
      where: { productId: id },
    });
    
    if (invoiceItemCount > 0) {
      throw new BadRequestException('Cannot delete product used in invoices');
    }
    
    // Use transaction to delete product and related data
    return this.prisma.$transaction(async (prisma) => {
      // Delete attributes
      await prisma.productAttribute.deleteMany({
        where: { productId: id },
      });
      
      // Delete price list items
      await prisma.priceListItem.deleteMany({
        where: { productId: id },
      });
      
      // Delete product
      return prisma.product.delete({
        where: { id },
      });
    });
  }
}
