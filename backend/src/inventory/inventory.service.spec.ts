import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInventoryDto, CreateInventoryTransactionDto } from './dto';

const mockPrismaService = {
  inventory: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
  },
  warehouse: {
    findUnique: jest.fn(),
  },
  warehouseLocation: {
    findUnique: jest.fn(),
  },
  inventoryTransaction: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrismaService)),
};

describe('InventoryService', () => {
  let service: InventoryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an inventory record', async () => {
      const createInventoryDto: CreateInventoryDto = {
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        quantity: 10,
        minStockLevel: 5,
      };

      const expectedInventory = {
        id: 1,
        ...createInventoryDto,
        maxStockLevel: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.product.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouseLocation.findUnique.mockResolvedValue({ 
        id: 1, 
        warehouseId: 1 
      });
      mockPrismaService.inventory.findFirst.mockResolvedValue(null);
      mockPrismaService.inventory.create.mockResolvedValue(expectedInventory);

      const result = await service.create(createInventoryDto);

      expect(result).toEqual(expectedInventory);
      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: createInventoryDto.productId },
      });
      expect(mockPrismaService.warehouse.findUnique).toHaveBeenCalledWith({
        where: { id: createInventoryDto.warehouseId },
      });
      expect(mockPrismaService.warehouseLocation.findUnique).toHaveBeenCalledWith({
        where: { id: createInventoryDto.locationId },
      });
      expect(mockPrismaService.inventory.findFirst).toHaveBeenCalled();
      expect(mockPrismaService.inventory.create).toHaveBeenCalledWith({
        data: createInventoryDto,
      });
    });

    it('should throw an error if product does not exist', async () => {
      const createInventoryDto: CreateInventoryDto = {
        productId: 999,
        warehouseId: 1,
        quantity: 10,
        minStockLevel: 5,
      };

      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.create(createInventoryDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated inventory records', async () => {
      const expectedInventoryItems = [
        {
          id: 1,
          productId: 1,
          warehouseId: 1,
          locationId: 1,
          quantity: 10,
          minStockLevel: 5,
          maxStockLevel: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          product: {
            id: 1,
            code: 'P001',
            name: 'Product 1',
            unit: 'pcs',
          },
          warehouse: {
            id: 1,
            name: 'Warehouse 1',
          },
          location: {
            id: 1,
            zone: 'A',
            aisle: '1',
            rack: '1',
            shelf: '1',
            position: '1',
          },
        },
      ];
      
      const totalCount = 1;

      mockPrismaService.inventory.findMany.mockResolvedValue(expectedInventoryItems);
      mockPrismaService.inventory.count.mockResolvedValue(totalCount);

      const result = await service.findAll(1, 1, 1, false, 1, 10);

      expect(result).toEqual({
        items: expectedInventoryItems,
        meta: {
          page: 1,
          limit: 10,
          total: totalCount,
          pages: 1,
        },
      });
      expect(mockPrismaService.inventory.findMany).toHaveBeenCalled();
      expect(mockPrismaService.inventory.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an inventory record by id', async () => {
      const expectedInventory = {
        id: 1,
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        quantity: 10,
        minStockLevel: 5,
        maxStockLevel: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: { id: 1, name: 'Product 1' },
        warehouse: { id: 1, name: 'Warehouse 1' },
        location: { id: 1, zone: 'A' },
      };

      mockPrismaService.inventory.findUnique.mockResolvedValue(expectedInventory);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedInventory);
      expect(mockPrismaService.inventory.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          product: true,
          warehouse: true,
          location: true,
        },
      });
    });

    it('should throw an error if inventory record not found', async () => {
      mockPrismaService.inventory.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTransaction', () => {
    it('should create an inventory transaction and update inventory', async () => {
      const createTransactionDto: CreateInventoryTransactionDto = {
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        transactionType: 'in',
        quantity: 5,
      };

      const expectedTransaction = {
        id: 1,
        ...createTransactionDto,
        referenceType: null,
        referenceId: null,
        userId: null,
        notes: null,
        createdAt: new Date(),
      };

      const existingInventory = {
        id: 1,
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        quantity: 10,
      };

      mockPrismaService.product.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouseLocation.findUnique.mockResolvedValue({ 
        id: 1, 
        warehouseId: 1 
      });
      mockPrismaService.inventoryTransaction.create.mockResolvedValue(expectedTransaction);
      mockPrismaService.inventory.findFirst.mockResolvedValue(existingInventory);
      mockPrismaService.inventory.update.mockResolvedValue({
        ...existingInventory,
        quantity: 15,
      });

      const result = await service.createTransaction(createTransactionDto);

      expect(result).toEqual(expectedTransaction);
      expect(mockPrismaService.inventoryTransaction.create).toHaveBeenCalledWith({
        data: createTransactionDto,
      });
      expect(mockPrismaService.inventory.update).toHaveBeenCalledWith({
        where: { id: existingInventory.id },
        data: { quantity: 15 },
      });
    });

    it('should throw an error for "out" transaction with insufficient stock', async () => {
      const createTransactionDto: CreateInventoryTransactionDto = {
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        transactionType: 'out',
        quantity: 15,
      };

      const existingInventory = {
        id: 1,
        productId: 1,
        warehouseId: 1,
        locationId: 1,
        quantity: 10,
      };

      mockPrismaService.product.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouseLocation.findUnique.mockResolvedValue({ 
        id: 1, 
        warehouseId: 1 
      });
      mockPrismaService.inventory.findFirst.mockResolvedValue(existingInventory);

      await expect(service.createTransaction(createTransactionDto)).rejects.toThrow(BadRequestException);
    });
  });
});
