import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto } from './dto';

@Injectable()
export class ProductAttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductAttributeDto: CreateProductAttributeDto) {
    // Check if product exists using raw query
    const products = await this.prisma.$queryRaw`
      SELECT id FROM "Product" WHERE id = ${createProductAttributeDto.productId}
    `;

    if (!products || (products as any[]).length === 0) {
      throw new BadRequestException(`Product with ID ${createProductAttributeDto.productId} not found`);
    }

    // Check if attribute with same name already exists for this product
    const existingAttributes = await this.prisma.$queryRaw`
      SELECT id FROM "ProductAttribute" 
      WHERE "productId" = ${createProductAttributeDto.productId} 
      AND "attributeName" = ${createProductAttributeDto.attributeName}
    `;

    if (existingAttributes && (existingAttributes as any[]).length > 0) {
      throw new BadRequestException(
        `Attribute '${createProductAttributeDto.attributeName}' already exists for this product`
      );
    }

    // Create the attribute
    await this.prisma.$executeRaw`
      INSERT INTO "ProductAttribute" ("productId", "attributeName", "attributeValue", "createdAt", "updatedAt")
      VALUES (
        ${createProductAttributeDto.productId}, 
        ${createProductAttributeDto.attributeName}, 
        ${createProductAttributeDto.attributeValue},
        NOW(),
        NOW()
      )
    `;
    
    // Return the created attribute by fetching it
    const createdAttributes = await this.prisma.$queryRaw`
      SELECT * FROM "ProductAttribute"
      WHERE "productId" = ${createProductAttributeDto.productId}
      AND "attributeName" = ${createProductAttributeDto.attributeName}
      AND "attributeValue" = ${createProductAttributeDto.attributeValue}
      ORDER BY "id" DESC
      LIMIT 1
    `;
    
    return createdAttributes && (createdAttributes as any[]).length > 0 
      ? (createdAttributes as any[])[0] 
      : null;
  }

  async findAll(productId?: number) {
    if (productId) {
      // Check if product exists
      const products = await this.prisma.$queryRaw`
        SELECT id FROM "Product" WHERE id = ${productId}
      `;      if (!products || (products as any[]).length === 0) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }

      // Get attributes for this product
      return this.prisma.$queryRaw`
        SELECT pa.*, p.name as "productName", p.sku as "productCode" 
        FROM "ProductAttribute" pa
        JOIN "Product" p ON pa."productId" = p.id
        WHERE pa."productId" = ${productId}
        ORDER BY pa."attributeName" ASC
      `;
    }

    // Get all attributes with product info
    return this.prisma.$queryRaw`
      SELECT pa.*, p.name as "productName", p.sku as "productCode" 
      FROM "ProductAttribute" pa
      JOIN "Product" p ON pa."productId" = p.id
      ORDER BY pa."productId" ASC, pa."attributeName" ASC
    `;
  }
  async findOne(id: number) {
    const attributes = await this.prisma.$queryRaw`
      SELECT pa.*, p.name as "productName", p.sku as "productCode" 
      FROM "ProductAttribute" pa
      JOIN "Product" p ON pa."productId" = p.id
      WHERE pa.id = ${id}
    `;

    if (!attributes || (attributes as any[]).length === 0) {
      throw new NotFoundException(`Product attribute with ID ${id} not found`);
    }

    return (attributes as any[])[0];
  }

  async update(id: number, updateProductAttributeDto: UpdateProductAttributeDto) {
    // Check if attribute exists
    const attributes = await this.prisma.$queryRaw`
      SELECT * FROM "ProductAttribute" WHERE id = ${id}
    `;

    if (!attributes || (attributes as any[]).length === 0) {
      throw new NotFoundException(`Product attribute with ID ${id} not found`);
    }

    const attribute = (attributes as any[])[0];

    // If changing productId, check if the product exists
    if (updateProductAttributeDto.productId) {
      const products = await this.prisma.$queryRaw`
        SELECT id FROM "Product" WHERE id = ${updateProductAttributeDto.productId}
      `;

      if (!products || (products as any[]).length === 0) {
        throw new BadRequestException(`Product with ID ${updateProductAttributeDto.productId} not found`);
      }
    }

    // If changing attributeName, check if it would create a duplicate
    if (updateProductAttributeDto.attributeName && updateProductAttributeDto.attributeName !== attribute.attributeName) {
      const productId = updateProductAttributeDto.productId || attribute.productId;
      
      const existingAttributes = await this.prisma.$queryRaw`
        SELECT id FROM "ProductAttribute" 
        WHERE "productId" = ${productId} 
        AND "attributeName" = ${updateProductAttributeDto.attributeName}
        AND id <> ${id}
      `;

      if (existingAttributes && (existingAttributes as any[]).length > 0) {
        throw new BadRequestException(
          `Attribute '${updateProductAttributeDto.attributeName}' already exists for this product`
        );
      }
    }

    // Build the update query dynamically
    let updateQuery = 'UPDATE "ProductAttribute" SET "updatedAt" = NOW()';
    
    if (updateProductAttributeDto.productId) {
      updateQuery += `, "productId" = ${updateProductAttributeDto.productId}`;
    }
    
    if (updateProductAttributeDto.attributeName) {
      updateQuery += `, "attributeName" = '${updateProductAttributeDto.attributeName}'`;
    }
    
    if (updateProductAttributeDto.attributeValue) {
      updateQuery += `, "attributeValue" = '${updateProductAttributeDto.attributeValue}'`;
    }
    
    updateQuery += ` WHERE id = ${id}`;
    
    // Execute the update
    await this.prisma.$executeRawUnsafe(updateQuery);

    // Return the updated attribute
    return this.findOne(id);
  }

  async remove(id: number) {
    // Check if attribute exists
    const attribute = await this.findOne(id);

    // Delete the attribute
    await this.prisma.$executeRaw`
      DELETE FROM "ProductAttribute" WHERE id = ${id}
    `;

    return attribute;
  }

  async bulkCreate(attributes: CreateProductAttributeDto[]) {
    // Group attributes by productId for validation
    const productIds = [...new Set(attributes.map(attr => attr.productId))];
    
    // Check if all products exist
    for (const productId of productIds) {
      const products = await this.prisma.$queryRaw`
        SELECT id FROM "Product" WHERE id = ${productId}
      `;

      if (!products || (products as any[]).length === 0) {
        throw new BadRequestException(`Product with ID ${productId} not found`);
      }
    }

    // Create attributes one by one to handle duplicates properly
    let createdCount = 0;
    
    for (const attr of attributes) {
      try {
        await this.create(attr);
        createdCount++;
      } catch (error) {
        // Ignore duplicate errors
        if (!(error instanceof BadRequestException && error.message.includes('already exists'))) {
          throw error;
        }
      }
    }

    return { count: createdCount };
  }

  async removeAllForProduct(productId: number) {
    // Check if product exists
    const products = await this.prisma.$queryRaw`
      SELECT id FROM "Product" WHERE id = ${productId}
    `;

    if (!products || (products as any[]).length === 0) {
      throw new BadRequestException(`Product with ID ${productId} not found`);
    }

    // Delete all attributes for this product
    const result = await this.prisma.$executeRaw`
      DELETE FROM "ProductAttribute" WHERE "productId" = ${productId}
    `;

    return { count: result };
  }

  async getAttributeSummary() {
    // Get all unique attribute names
    const attributesRaw = await this.prisma.$queryRaw`
      SELECT DISTINCT "attributeName" 
      FROM "ProductAttribute" 
      ORDER BY "attributeName" ASC
    `;
    
    // Get count of values for each attribute name
    const attributeSummary = await Promise.all(
      (attributesRaw as any[]).map(async (attr) => {
        const valuesRaw = await this.prisma.$queryRaw`
          SELECT DISTINCT "attributeValue" 
          FROM "ProductAttribute" 
          WHERE "attributeName" = ${attr.attributeName}
          ORDER BY "attributeValue" ASC
        `;
        
        return {
          name: attr.attributeName,
          valueCount: (valuesRaw as any[]).length,
          values: (valuesRaw as any[]).map(v => v.attributeValue),
        };
      })
    );
    
    return attributeSummary;
  }
  
  async getCommonAttributes() {
    // Get attribute names and how many times they're used
    const attributeCounts = await this.prisma.$queryRaw`
      SELECT "attributeName", COUNT(DISTINCT "productId") as "productCount" 
      FROM "ProductAttribute" 
      GROUP BY "attributeName" 
      ORDER BY "productCount" DESC, "attributeName" ASC
    `;
    
    // For the top 10 most common attributes, get their common values
    const commonAttributes = await Promise.all(
      (attributeCounts as any[]).slice(0, 10).map(async (attr) => {
        // Get most common values for this attribute
        const valueCounts = await this.prisma.$queryRaw`
          SELECT "attributeValue", COUNT(*) as "count" 
          FROM "ProductAttribute" 
          WHERE "attributeName" = ${attr.attributeName}
          GROUP BY "attributeValue" 
          ORDER BY "count" DESC, "attributeValue" ASC
          LIMIT 20
        `;
        
        return {
          name: attr.attributeName,
          productCount: Number(attr.productCount),
          commonValues: (valueCounts as any[]).map(v => ({
            value: v.attributeValue,
            count: Number(v.count),
          })),
        };
      })
    );
    
    return commonAttributes;
  }
}
