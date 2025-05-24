import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    // Check if parent category exists when parentId is provided
    if (createProductCategoryDto.parentId) {
      const parentCategory = await this.prisma.productCategory.findUnique({
        where: { id: createProductCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(`Parent category with ID ${createProductCategoryDto.parentId} not found`);
      }
    }

    return this.prisma.productCategory.create({
      data: createProductCategoryDto,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true,
          }
        }
      },
    });
  }
  async findAll() {
    // Get all categories with their relationships and counts
    const allCategories = await this.prisma.productCategory.findMany({
      include: {
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' }
      ]
    });

    // Helper function to build tree structure with proper typing
    const buildCategoryTree = (categories: any[], parentId: number | null = null): any[] => {
      const filteredCategories = categories.filter(category => category.parentId === parentId);
      
      return filteredCategories.map(category => {
        // Find direct children
        const children = buildCategoryTree(categories, category.id);
        
        // Return category with children property only if it has children
        return {
          ...category,
          children: children.length > 0 ? children : undefined,
          level: parentId === null ? 0 : categories.find(c => c.id === parentId)?.level + 1 || 0
        };
      });
    };

    // Generate the tree structure starting from root categories
    const categoryTree = buildCategoryTree(allCategories);
    return categoryTree;
  }

  async findOne(id: number) {
    const category = await this.prisma.productCategory.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
          },
        },
        children: {
          include: {
            _count: {
              select: {
                products: true,
                children: true
              }
            }
          }
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    await this.findOne(id);
    
    if (updateProductCategoryDto.parentId === id) {
      throw new BadRequestException('A category cannot be its own parent');
    }

    if (updateProductCategoryDto.parentId) {
      await this.validateNoCircularReference(id, updateProductCategoryDto.parentId);
      
      const parentCategory = await this.prisma.productCategory.findUnique({
        where: { id: updateProductCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(`Parent category with ID ${updateProductCategoryDto.parentId} not found`);
      }
    }

    return this.prisma.productCategory.update({
      where: { id },
      data: updateProductCategoryDto,
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            children: true
          }
        }
      },
    });
  }

  async remove(id: number) {
    // Check if category exists
    await this.findOne(id);
    
    // Check if category has children
    const childrenCount = await this.prisma.productCategory.count({
      where: { parentId: id },
    });
    
    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete category with child categories');
    }
    
    // Check if category has products
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    
    if (productsCount > 0) {
      throw new BadRequestException('Cannot delete category with products');
    }
    
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
  
  private async validateNoCircularReference(categoryId: number, newParentId: number) {
    const descendants = await this.getAllDescendants(categoryId);
    if (descendants.some(desc => desc.id === newParentId)) {
      throw new BadRequestException('Circular category reference detected');
    }
  }

  private async getAllDescendants(categoryId: number, descendants: { id: number }[] = []) {
    const children = await this.prisma.productCategory.findMany({
      where: { parentId: categoryId },
      select: { id: true },
    });
    
    if (children.length === 0) {
      return descendants;
    }
    
    descendants.push(...children);
    
    for (const child of children) {
      await this.getAllDescendants(child.id, descendants);
    }
    
    return descendants;
  }
}
