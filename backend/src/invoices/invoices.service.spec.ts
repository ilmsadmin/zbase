import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { PrismaService } from '../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let prismaService: PrismaService;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: PrismaService,
          useValue: {
            invoice: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback(prismaStub)),
          },
        },
        {
          provide: InventoryService,
          useValue: {
            decreaseStock: jest.fn(),
            increaseStock: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    prismaService = module.get<PrismaService>(PrismaService);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  // Create a stub for prisma to use in transactions
  const prismaStub = {
    invoice: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        userId: 1,
        warehouseId: 1,
        items: [
          {
            productId: 1,
            quantity: 2,
            unitPrice: 100,
          },
        ],
      };

      const mockInvoice = {
        id: 1,
        code: 'INV20250501001',
        customerId: null,
        userId: 1,
        warehouseId: 1,
        subtotal: 200,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 200,
        paidAmount: 0,
        status: 'pending',
        items: [{
          id: 1,
          productId: 1,
          quantity: 2,
          unitPrice: 100,
          totalAmount: 200,
        }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return mockInvoice;
      });

      (prismaService.invoice.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.create(createInvoiceDto);
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      const mockInvoices = [
        { id: 1, code: 'INV20250501001' },
        { id: 2, code: 'INV20250501002' },
      ];

      (prismaService.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);
      (prismaService.invoice.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll(1, 1, 1, 'pending', new Date(), new Date(), 'test', 1, 10);

      expect(prismaService.invoice.findMany).toHaveBeenCalled();
      expect(prismaService.invoice.count).toHaveBeenCalled();
      expect(result).toEqual({
        items: mockInvoices,
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return an invoice by id', async () => {
      const mockInvoice = { id: 1, code: 'INV20250501001' };
      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await service.findOne(1);

      expect(prismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.any(Object),
      });
      expect(result).toBe(mockInvoice);
    });

    it('should throw NotFoundException if invoice not found', async () => {
      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an invoice successfully', async () => {
      const existingInvoice = {
        id: 1,
        code: 'INV20250501001',
        status: 'pending',
        items: [],
      };

      const updateDto = { notes: 'Updated Notes' };

      const updatedInvoice = {
        ...existingInvoice,
        ...updateDto,
      };

      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(existingInvoice);
      (prismaService.invoice.update as jest.Mock).mockResolvedValue(updatedInvoice);

      const result = await service.update(1, updateDto);

      expect(prismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { items: true },
      });
      expect(prismaService.invoice.update).toHaveBeenCalled();
      expect(result).toBe(updatedInvoice);
    });

    it('should throw BadRequestException if invoice is already paid', async () => {
      const existingInvoice = {
        id: 1,
        status: 'paid',
        items: [],
      };

      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(existingInvoice);

      await expect(service.update(1, { notes: 'Cannot update' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelInvoice', () => {
    it('should cancel an invoice successfully', async () => {
      const existingInvoice = {
        id: 1,
        code: 'INV20250501001',
        status: 'pending',
        warehouseId: 1,
        items: [
          { id: 1, productId: 1, quantity: 2, locationId: 3 },
        ],
      };

      const cancelledInvoice = {
        ...existingInvoice,
        status: 'canceled',
        notes: 'Cancellation reason: Customer cancelled',
      };

      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(existingInvoice);
      (prismaService.$transaction as jest.Mock).mockResolvedValue(cancelledInvoice);

      const result = await service.cancelInvoice(1, 'Customer cancelled');

      expect(prismaService.invoice.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { items: true },
      });
      expect(result).toBe(cancelledInvoice);
    });

    it('should throw BadRequestException if invoice is already paid', async () => {
      const existingInvoice = {
        id: 1,
        status: 'paid',
        items: [],
      };

      (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(existingInvoice);

      await expect(service.cancelInvoice(1, 'Cannot cancel')).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException as invoices should not be deleted', async () => {
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
