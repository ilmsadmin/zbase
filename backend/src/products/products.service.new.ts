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
    // Create a copy of the DTO to modify
    const dto = { ...createProductDto };
    
    // Ensure numeric fields are converted from strings if needed
    const numericFields = ['price', 'costPrice', 'categoryId', 'minStockLevel', 
                          'maxStockLevel', 'reorderLevel', 'weight'];
    
    numericFields.forEach(field => {
      if (field in dto && typeof dto[field] === 'string') {
        dto[field] = Number(dto[field]);
      }
    });
    
    // Make sure all boolean fields are properly converted
    if ('isActive' in dto && typeof dto.isActive === 'string') {
      dto.isActive = dto.isActive === 'true';
    }
    
    // Check if product with same sku already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: dto.sku },
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with SKU ${dto.sku} already exists`);
    }

    // Check if category exists when categoryId is provided
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    // Extract attributes from DTO and structure the data properly for Prisma
    const { attributes, categoryId, ...productData } = dto;

    // Prepare the product data with proper Decimal conversion for numeric fields
    const finalProductData = {
      ...productData,
      price: new Prisma.Decimal(productData.price),
      unit: productData.unit || 'unit',
      warrantyMonths: productData.warrantyMonths || 0,
      taxRate: productData.taxRate !== undefined ? new Prisma.Decimal(productData.taxRate) : new Prisma.Decimal(0),
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      // Handle optional Prisma.Decimal fields
      ...(productData.costPrice !== undefined ? { costPrice: new Prisma.Decimal(productData.costPrice) } : {}),
      ...(productData.minStockLevel !== undefined ? { minStockLevel: new Prisma.Decimal(productData.minStockLevel) } : {}),
      ...(productData.maxStockLevel !== undefined ? { maxStockLevel: new Prisma.Decimal(productData.maxStockLevel) } : {}),
      ...(productData.reorderLevel !== undefined ? { reorderLevel: new Prisma.Decimal(productData.reorderLevel) } : {}),
      ...(productData.weight !== undefined ? { weight: new Prisma.Decimal(productData.weight) } : {}),
    };

    // Use transaction to create product and attributes
    return this.prisma.$transaction(async (prisma) => {
      // Create product with proper data structure
      const product = await prisma.product.create({
        data: {
          ...finalProductData,
          ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
        },
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
        { sku: { contains: search, mode: 'insensitive' } },
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
      items: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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
    // Create a copy of the DTO to modify
    const dto = { ...updateProductDto };
    
    // Ensure numeric fields are converted from strings if needed
    const numericFields = ['price', 'costPrice', 'categoryId', 'minStockLevel', 
                          'maxStockLevel', 'reorderLevel', 'weight'];
    
    numericFields.forEach(field => {
      if (field in dto && typeof dto[field] === 'string') {
        dto[field] = Number(dto[field]);
      }
    });
    
    // Make sure all boolean fields are properly converted
    if ('isActive' in dto && typeof dto.isActive === 'string') {
      dto.isActive = dto.isActive === 'true';
    }
    
    // Check if product exists
    await this.findOne(id);
    
    // Check if sku is being changed and if new sku already exists
    if (dto.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { 
          sku: dto.sku,
          id: { not: id },
        },
      });
      
      if (existingProduct) {
        throw new BadRequestException(`Product with SKU ${dto.sku} already exists`);
      }
    }

    // Check if category exists when categoryId is provided
    if (dto.categoryId) {
      const category = await this.prisma.productCategory.findUnique({
        where: { id: dto.categoryId },
      });
      
      if (!category) {
        throw new BadRequestException(`Category with ID ${dto.categoryId} not found`);
      }
    }

    // Extract attributes from DTO
    const { attributes, categoryId, ...productData } = dto;

    // Prepare update data with proper Decimal conversion
    const updateData: any = {};
    
    // Handle simple fields
    const simpleFields = ['sku', 'name', 'description', 'barcode', 'unit', 'manufacturer', 'warrantyMonths', 'dimensions', 'imageUrl', 'isActive'];
    simpleFields.forEach(field => {
      if (productData[field] !== undefined) {
        updateData[field] = productData[field];
      }
    });
    
    // Handle Decimal fields
    const decimalFields = ['price', 'costPrice', 'taxRate', 'minStockLevel', 'maxStockLevel', 'reorderLevel', 'weight'];
    decimalFields.forEach(field => {
      if (productData[field] !== undefined) {
        updateData[field] = new Prisma.Decimal(productData[field]);
      }
    });
    
    // Handle category relationship
    if (categoryId !== undefined) {
      if (categoryId) {
        updateData.category = { connect: { id: categoryId } };
      } else {
        updateData.category = { disconnect: true };
      }
    }

    // Use transaction to update product and attributes
    return this.prisma.$transaction(async (prisma) => {
      // Update product
      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Update attributes if provided
      if (attributes !== undefined) {
        // Delete existing attributes
        await prisma.productAttribute.deleteMany({
          where: { productId: id },
        });
        
        // Create new attributes if any
        if (attributes.length > 0) {
          await prisma.productAttribute.createMany({
            data: attributes.map(attr => ({
              productId: id,
              attributeName: attr.attributeName,
              attributeValue: attr.attributeValue,
            })),
          });
        }
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
