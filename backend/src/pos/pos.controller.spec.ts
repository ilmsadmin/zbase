import { Test, TestingModule } from '@nestjs/testing';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';
import { CreateQuickSaleDto, InventoryCheckDto } from './dto';
import { Prisma } from '@prisma/client';
import { mockPosService } from './pos.service.mock';
import { PosServiceInterface } from './pos-service.interface';

describe('PosController', () => {
  let controller: PosController;
  let service: PosServiceInterface;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PosController],
      providers: [
        {
          provide: PosService,
          useValue: mockPosService,
        },
      ],
    }).compile();    controller = module.get<PosController>(PosController);
    service = module.get(PosService) as unknown as PosServiceInterface;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkActiveShift', () => {
    it('should check for an active shift', async () => {
      const userId = 1;      const expectedResult = {
        hasActiveShift: true,
        shiftData: { 
          id: 1, 
          userId, 
          status: 'open',
          user: { id: userId, name: 'Test User' },
          warehouse: { id: 1, name: 'Test Warehouse' },
          createdAt: new Date(),
          updatedAt: new Date(),
          warehouseId: 1,
          notes: null,
          startAmount: new Prisma.Decimal(100),
          endAmount: null,
          startTime: new Date(),
          endTime: null
        },
      };

      jest.spyOn(service, 'checkActiveShift').mockResolvedValue(expectedResult);

      const result = await controller.checkActiveShift(userId);

      expect(result).toEqual(expectedResult);
      expect(service.checkActiveShift).toHaveBeenCalledWith(userId);
    });
  });

  describe('createQuickSale', () => {
    it('should create a quick sale', async () => {
      const userId = 1;
      const createQuickSaleDto: CreateQuickSaleDto = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1, unitPrice: 25 },
        ],
      };      const expectedResult = { id: 1, code: 'INV-2025050001', items: [], totalAmount: new Prisma.Decimal(75) };

      jest.spyOn(service, 'createQuickSale').mockResolvedValue(expectedResult);

      const result = await controller.createQuickSale(createQuickSaleDto, userId);

      expect(result).toEqual(expectedResult);
      expect(service.createQuickSale).toHaveBeenCalledWith(createQuickSaleDto, userId);
    });
  });

  describe('checkInventory', () => {
    it('should check inventory availability', async () => {
      const userId = 1;
      const inventoryCheckDto: InventoryCheckDto = {
        items: [
          { productId: 1, quantity: 5 },
          { productId: 2, quantity: 3 },
        ],
      };
      const expectedResult = {
        warehouseId: 1,
        warehouseName: 'Main Warehouse',
        items: [],
        allItemsAvailable: true,
      };

      jest.spyOn(service, 'checkInventory').mockResolvedValue(expectedResult);

      const result = await controller.checkInventory(inventoryCheckDto, userId);

      expect(result).toEqual(expectedResult);
      expect(service.checkInventory).toHaveBeenCalledWith(inventoryCheckDto, userId);
    });
  });

  describe('getDashboardData', () => {
    it('should get dashboard data for active shift', async () => {
      const userId = 1;      const expectedResult = {
        shiftId: 1,
        warehouseId: 1,
        userId,
        date: new Date(),
        totalSales: 500,
        totalInvoices: 5,
        pendingInvoices: 2,
        cashReceived: 300,
        cardReceived: 200,
        topSellingProducts: [],
      };

      jest.spyOn(service, 'getDashboardData').mockResolvedValue(expectedResult);

      const result = await controller.getDashboardData(userId);

      expect(result).toEqual(expectedResult);
      expect(service.getDashboardData).toHaveBeenCalledWith(userId);
    });
  });
  describe('getRecentSales', () => {
    it('should get recent sales for active shift', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const expectedResult = {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      jest.spyOn(service, 'getRecentSales').mockResolvedValue(expectedResult);

      const result = await controller.getRecentSales(userId, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.getRecentSales).toHaveBeenCalledWith(userId, page, limit);
    });
  });
  describe('searchProducts', () => {
    it('should search for products', async () => {
      const query = 'test';
      const warehouseId = 1;
      const page = 1;
      const limit = 20;
      const expectedResult = {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      jest.spyOn(service, 'searchProducts').mockResolvedValue(expectedResult);

      const result = await controller.searchProducts(query, warehouseId, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.searchProducts).toHaveBeenCalledWith(query, warehouseId, page, limit);
    });
  });

  describe('searchCustomers', () => {
    it('should search for customers', async () => {
      const query = 'test';
      const page = 1;
      const limit = 20;
      const expectedResult = {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      jest.spyOn(service, 'searchCustomers').mockResolvedValue(expectedResult);

      const result = await controller.searchCustomers(query, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.searchCustomers).toHaveBeenCalledWith(query, page, limit);
    });
  });
});
