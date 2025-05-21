import { Test, TestingModule } from '@nestjs/testing';
import { PosService } from './pos.service';
import { PrismaService } from '../prisma/prisma.service';
import { ShiftsService } from '../shifts/shifts.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateQuickSaleDto, InventoryCheckDto } from './dto';
import { Prisma } from '@prisma/client';

describe('PosService', () => {
  let service: PosService;
  let prismaService: PrismaService;
  let shiftsService: ShiftsService;
  beforeEach(async () => {
    const mockPrismaService = {
      customer: {
        findUnique: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      inventory: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
      },
      invoice: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      invoiceItem: {
        groupBy: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
        aggregate: jest.fn().mockReturnValue({ _sum: { amount: new Prisma.Decimal(0) } }),
      },
      inventoryTransaction: {
        create: jest.fn(),
      },
      warehouse: {
        findUnique: jest.fn(),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ totalSales: 0, totalInvoices: 0, pendingInvoices: 0 }]),
    };

    const mockShiftsService = {
      findCurrentShift: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ShiftsService,
          useValue: mockShiftsService,
        },
      ],
    }).compile();    service = module.get<PosService>(PosService);
    prismaService = module.get<PrismaService>(PrismaService);
    shiftsService = module.get<ShiftsService>(ShiftsService);
    
    // Ensure these properties are properly set
    Object.defineProperty(service, 'prisma', { 
      value: prismaService,
      writable: true,
      configurable: true
    });
    Object.defineProperty(service, 'shiftsService', { 
      value: shiftsService,
      writable: true,
      configurable: true
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkActiveShift', () => {
    it('should return active shift data when a shift is active', async () => {
      const userId = 1;
      const activeShift = { id: 1, userId, status: 'open' };

      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);

      const result = await service.checkActiveShift(userId);

      expect(result).toEqual({
        hasActiveShift: true,
        shiftData: activeShift,
      });
    });

    it('should return false when no active shift is found', async () => {
      const userId = 1;

      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(null);

      const result = await service.checkActiveShift(userId);

      expect(result).toEqual({
        hasActiveShift: false,
        message: 'No active shift found for the user',
      });
    });
  });

  describe('createQuickSale', () => {
    const userId = 1;
    const activeShift = {
      id: 1,
      userId,
      warehouseId: 1,
      status: 'open',
      warehouse: { id: 1, name: 'Main Warehouse' },
    };

    const createQuickSaleDto: CreateQuickSaleDto = {
      items: [
        { productId: 1, quantity: 2 },
      ],
      customerId: 1,
      paidAmount: 50,
    };

    const product = { id: 1, name: 'Product 1', basePrice: 25, taxRate: 10 };
    const customer = { id: 1, name: 'Customer 1' };
    const inventory = { productId: 1, warehouseId: 1, quantity: 10, locationId: 1 };
    const invoice = { id: 1, code: 'INV-2025050001' };

    it('should create a quick sale successfully', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer as any);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(product as any);
      jest.spyOn(prismaService.inventory, 'findFirst').mockResolvedValue(inventory as any);
      jest.spyOn(prismaService.invoice, 'count').mockResolvedValue(0);
      jest.spyOn(prismaService.invoice, 'create').mockResolvedValue(invoice as any);
      jest.spyOn(prismaService.transaction, 'count').mockResolvedValue(0);

      await service.createQuickSale(createQuickSaleDto, userId);

      expect(prismaService.invoice.create).toHaveBeenCalled();
      expect(prismaService.inventory.updateMany).toHaveBeenCalled();
      expect(prismaService.inventoryTransaction.create).toHaveBeenCalled();
      expect(prismaService.transaction.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when no active shift is found', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(null);

      await expect(service.createQuickSale(createQuickSaleDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when customer is not found', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(null);

      await expect(service.createQuickSale(createQuickSaleDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product is not found', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer as any);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.createQuickSale(createQuickSaleDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when inventory is insufficient', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer as any);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(product as any);
      jest.spyOn(prismaService.inventory, 'findFirst').mockResolvedValue(null);

      await expect(service.createQuickSale(createQuickSaleDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkInventory', () => {
    const userId = 1;
    const activeShift = {
      id: 1,
      userId,
      warehouseId: 1,
      status: 'open',
      warehouse: { id: 1, name: 'Main Warehouse' },
    };

    const inventoryCheckDto: InventoryCheckDto = {
      items: [
        { productId: 1, quantity: 2 },
      ],
    };    it('should return inventory status for requested items', async () => {
      const inventory = {
        product: { id: 1, name: 'Product 1' },
        quantity: 5,
        location: { id: 1, zone: 'A' },
      };

      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.inventory, 'findFirst').mockResolvedValue(inventory as any);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue({ id: 1, name: 'Product 1', code: 'P001' } as any);
      jest.spyOn(prismaService.warehouse, 'findUnique').mockResolvedValue({ id: 1, name: 'Main Warehouse' } as any);
      
      const result = await service.checkInventory(inventoryCheckDto, userId);

      expect(result.warehouseId).toEqual(activeShift.warehouseId);
      expect(result.items.length).toEqual(1);
      expect(result.items[0].isAvailable).toBe(true);
    });

    it('should throw BadRequestException when no active shift is found', async () => {
      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(null);

      await expect(service.checkInventory(inventoryCheckDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });  describe('getDashboardData', () => {
    const userId = 1;
    const activeShift = {
      id: 1,
      userId,
      warehouseId: 1,
      status: 'open',
      warehouse: { id: 1, name: 'Main Warehouse' },
    };

    it('should return dashboard data for the active shift', async () => {
      const invoices = [
        { id: 1, totalAmount: new Prisma.Decimal(100) },
        { id: 2, totalAmount: new Prisma.Decimal(150) },
      ];

      const transactions = [
        { id: 1, transactionType: 'receipt', transactionMethod: 'cash', amount: new Prisma.Decimal(100) },
        { id: 2, transactionType: 'receipt', transactionMethod: 'card', amount: new Prisma.Decimal(150) },
      ];

      const topProducts = [
        { productId: 1, _sum: { quantity: 5, totalAmount: new Prisma.Decimal(100) } },
      ];

      const salesStats = [{ totalSales: 250, totalInvoices: 2, pendingInvoices: 0 }];

      jest.spyOn(shiftsService, 'findCurrentShift').mockResolvedValue(activeShift as any);
      jest.spyOn(prismaService.invoice, 'findMany').mockResolvedValue(invoices as any);
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(transactions as any);
      jest.spyOn(prismaService.invoiceItem, 'groupBy').mockResolvedValue(topProducts as any);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue({ id: 1, name: 'Product 1' } as any);
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(salesStats);
      
      jest.spyOn(prismaService.transaction, 'aggregate').mockImplementation((params) => {
        if (params.where?.transactionMethod === 'cash') {
          return { _sum: { amount: new Prisma.Decimal(100) } } as any;
        } else {
          return { _sum: { amount: new Prisma.Decimal(150) } } as any;
        }
      });

      const result = await service.getDashboardData(userId);

      expect(result.shiftId).toEqual(activeShift.id);
      expect(result.totalSales).toEqual(250);
      expect(result.cashReceived).toEqual(100);
      expect(result.cardReceived).toEqual(150);
    });
  });
  describe('searchProducts', () => {
    it('should return products matching the search query', async () => {
      const query = 'product';
      const warehouseId = 1;
      const products = [
        {
          id: 1,
          name: 'Product 1',
          code: 'P001',
          basePrice: new Prisma.Decimal(20),
          taxRate: new Prisma.Decimal(10),
          barcode: '12345',
          unit: 'pcs',
          inventory: [{ 
            quantity: 10, 
            location: { 
              id: 1,
              zone: 'A',
              aisle: '1',
              rack: '2',
              shelf: '3',
              position: '1'
            } 
          }],
        },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(products as any);
      jest.spyOn(prismaService.product, 'count').mockResolvedValue(1);

      const result = await service.searchProducts(query, warehouseId);

      expect(result.items.length).toEqual(1);
      expect(result.items[0].availableQuantity).toEqual(10);
    });
  });
  describe('searchCustomers', () => {
    it('should return customers matching the search query', async () => {
      const query = 'customer';
      const customers = [{ 
        id: 1, 
        name: 'Customer 1',
        code: 'C001',
        phone: '123456789',
        email: 'customer1@example.com',
        address: '123 Test St',
        group: {
          id: 1,
          name: 'Regular',
          discountRate: new Prisma.Decimal(5)
        }
      }];

      jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(customers as any);
      jest.spyOn(prismaService.customer, 'count').mockResolvedValue(1);

      const result = await service.searchCustomers(query);

      expect(result.items).toEqual(customers);
      expect(result.meta.total).toEqual(1);
    });
  });
});
