import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto';

const mockPrismaService = {
  product: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  productCategory: {
    findUnique: jest.fn(),
  },
  productAttribute: {
    createMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  inventory: {
    count: jest.fn(),
  },
  invoiceItem: {
    count: jest.fn(),
  },
  priceListItem: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
};

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateProductDto = {
      code: 'TEST001',
      name: 'Test Product',
      basePrice: 100,
      attributes: [
        { attributeName: 'Color', attributeValue: 'Red' },
      ],
    };

    it('should create a product with attributes', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      mockPrismaService.product.create.mockResolvedValue({ id: 1, ...createDto });
      mockPrismaService.product.findUnique.mockResolvedValue({
        id: 1,
        ...createDto,
        attributes: [{ id: 1, productId: 1, attributeName: 'Color', attributeValue: 'Red' }],
      });

      const result = await service.create(createDto);
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(mockPrismaService.product.create).toHaveBeenCalled();
      expect(mockPrismaService.productAttribute.createMany).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product code already exists', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue({ id: 2, code: 'TEST001' });
      
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [{ id: 1, name: 'Test Product' }];
      mockPrismaService.product.findMany.mockResolvedValue(products);
      mockPrismaService.product.count.mockResolvedValue(1);
      
      const result = await service.findAll();
      
      expect(result.data).toEqual(products);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([]);
      mockPrismaService.product.count.mockResolvedValue(0);
      
      await service.findAll(1);
      
      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            categoryId: 1,
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Test Product' };
      mockPrismaService.product.findUnique.mockResolvedValue(product);
      
      expect(await service.findOne(1)).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
