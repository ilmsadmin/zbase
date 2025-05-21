import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributesService } from './product-attributes.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateProductAttributeDto } from './dto';

// Mock PrismaService
const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
  },
  productAttribute: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  $queryRaw: jest.fn(),
};

describe('ProductAttributesService', () => {
  let service: ProductAttributesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductAttributesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductAttributesService>(ProductAttributesService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product attribute', async () => {
      // Arrange
      const createDto: CreateProductAttributeDto = {
        productId: 1,
        attributeName: 'Color',
        attributeValue: 'Red',
      };
      
      const mockProduct = { id: 1, name: 'Test Product' };
      const mockAttribute = { id: 1, ...createDto };
      
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productAttribute.findFirst.mockResolvedValue(null);
      mockPrismaService.productAttribute.create.mockResolvedValue(mockAttribute);
      
      // Act
      const result = await service.create(createDto);
      
      // Assert
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createDto.productId },
      });
      expect(mockPrismaService.productAttribute.findFirst).toHaveBeenCalledWith({
        where: {
          productId: createDto.productId,
          attributeName: createDto.attributeName,
        },
      });
      expect(mockPrismaService.productAttribute.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockAttribute);
    });
    
    it('should throw BadRequestException if product does not exist', async () => {
      // Arrange
      const createDto: CreateProductAttributeDto = {
        productId: 999,
        attributeName: 'Color',
        attributeValue: 'Red',
      };
      
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      
      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
    
    it('should throw BadRequestException if attribute with same name exists', async () => {
      // Arrange
      const createDto: CreateProductAttributeDto = {
        productId: 1,
        attributeName: 'Color',
        attributeValue: 'Red',
      };
      
      const mockProduct = { id: 1, name: 'Test Product' };
      const existingAttribute = { id: 1, ...createDto };
      
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productAttribute.findFirst.mockResolvedValue(existingAttribute);
      
      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all attributes when no productId is provided', async () => {
      // Arrange
      const mockAttributes = [
        { id: 1, productId: 1, attributeName: 'Color', attributeValue: 'Red' },
        { id: 2, productId: 2, attributeName: 'Size', attributeValue: 'Large' },
      ];
      
      mockPrismaService.productAttribute.findMany.mockResolvedValue(mockAttributes);
      
      // Act
      const result = await service.findAll();
      
      // Assert
      expect(mockPrismaService.productAttribute.findMany).toHaveBeenCalledWith({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
        orderBy: [
          { productId: 'asc' },
          { attributeName: 'asc' },
        ],
      });
      expect(result).toEqual(mockAttributes);
    });
    
    it('should return attributes for specific product when productId is provided', async () => {
      // Arrange
      const productId = 1;
      const mockProduct = { id: productId, name: 'Test Product' };
      const mockAttributes = [
        { id: 1, productId, attributeName: 'Color', attributeValue: 'Red' },
        { id: 2, productId, attributeName: 'Size', attributeValue: 'Large' },
      ];
      
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.productAttribute.findMany.mockResolvedValue(mockAttributes);
      
      // Act
      const result = await service.findAll(productId);
      
      // Assert
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(mockPrismaService.productAttribute.findMany).toHaveBeenCalledWith({
        where: { productId },
        orderBy: { attributeName: 'asc' },
      });
      expect(result).toEqual(mockAttributes);
    });
  });

  // Add more test cases for other methods...
});
