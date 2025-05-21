import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsService } from './shifts.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateShiftDto, CloseShiftDto, UpdateShiftDto } from './dto';

describe('ShiftsService', () => {
  let service: ShiftsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsService,
        {
          provide: PrismaService,
          useValue: {
            shift: {
              create: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
            },
            warehouse: {
              findUnique: jest.fn(),
            },
            invoice: {
              findMany: jest.fn(),
            },
            transaction: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ShiftsService>(ShiftsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createShiftDto: CreateShiftDto = {
      warehouseId: 1,
      startAmount: 100,
      notes: 'Morning shift',
    };
    const userId = 1;    const warehouse = { 
      id: 1, 
      name: 'Main Warehouse',
      address: '123 Warehouse St',
      managerId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const createdShift = {
      id: 1,
      userId,
      warehouseId: 1,
      startTime: new Date(),
      endTime: null,
      startAmount: new Prisma.Decimal(100),
      endAmount: null,
      status: 'open',
      notes: 'Morning shift',
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { id: userId, name: 'User' },
      warehouse,
    };

    it('should create a shift successfully', async () => {
      jest.spyOn(prismaService.shift, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.warehouse, 'findUnique').mockResolvedValue(warehouse);
      jest.spyOn(prismaService.shift, 'create').mockResolvedValue(createdShift);

      const result = await service.create(createShiftDto, userId);

      expect(result).toEqual(createdShift);
      expect(prismaService.shift.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          status: 'open',
        },
      });
      expect(prismaService.warehouse.findUnique).toHaveBeenCalledWith({
        where: { id: createShiftDto.warehouseId },
      });
      expect(prismaService.shift.create).toHaveBeenCalledWith({
        data: {
          userId,
          warehouseId: createShiftDto.warehouseId,
          startTime: expect.any(Date),
          startAmount: createShiftDto.startAmount,
          status: 'open',
          notes: createShiftDto.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });    it('should throw BadRequestException if user already has an open shift', async () => {
      const existingShift = {
        id: 2,
        userId,
        warehouseId: 1,
        status: 'open',
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        notes: 'Test shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      jest.spyOn(prismaService.shift, 'findFirst').mockResolvedValue(existingShift);

      await expect(service.create(createShiftDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if warehouse does not exist', async () => {
      jest.spyOn(prismaService.shift, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.warehouse, 'findUnique').mockResolvedValue(null);

      await expect(service.create(createShiftDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('findAll', () => {
    it('should return shifts with pagination', async () => {
      const shifts = [
        { 
          id: 1, 
          status: 'open',
          userId: 1,
          warehouseId: 1,
          startTime: new Date(),
          endTime: null,
          startAmount: new Prisma.Decimal(100),
          endAmount: null, 
          notes: 'Morning shift',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 2, 
          status: 'closed',
          userId: 1,
          warehouseId: 1,
          startTime: new Date(),
          endTime: new Date(),
          startAmount: new Prisma.Decimal(100),
          endAmount: new Prisma.Decimal(200),
          notes: 'Evening shift',
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      const count = 2;
      const page = 1;
      const limit = 10;

      jest.spyOn(prismaService.shift, 'findMany').mockResolvedValue(shifts);
      jest.spyOn(prismaService.shift, 'count').mockResolvedValue(count);

      const result = await service.findAll('open', 1, 1, page, limit);

      expect(result).toEqual({
        items: shifts,
        meta: {
          total: count,
          page,
          limit,
          totalPages: 1,
        },
      });
    });
  });
  describe('findOne', () => {
    it('should return a shift by id', async () => {
      const id = 1;
      const shift = { 
        id, 
        status: 'open',
        userId: 1,
        warehouseId: 1,
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        notes: 'Morning shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);

      const result = await service.findOne(id);

      expect(result).toEqual(shift);
      expect(prismaService.shift.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if shift not found', async () => {
      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
  describe('findCurrentShift', () => {
    it('should return the current open shift for a user', async () => {
      const userId = 1;
      const shift = { 
        id: 1, 
        userId,
        status: 'open',
        warehouseId: 1,
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        notes: 'Morning shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.shift, 'findFirst').mockResolvedValue(shift);

      const result = await service.findCurrentShift(userId);

      expect(result).toEqual(shift);
      expect(prismaService.shift.findFirst).toHaveBeenCalledWith({
        where: {
          userId,
          status: 'open',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    it('should return null if no open shift found', async () => {
      jest.spyOn(prismaService.shift, 'findFirst').mockResolvedValue(null);

      const result = await service.findCurrentShift(1);

      expect(result).toBeNull();
    });
  });
  describe('update', () => {
    it('should update a shift', async () => {
      const id = 1;
      const updateShiftDto: UpdateShiftDto = {
        notes: 'Updated notes',
      };
      
      const shift = { 
        id, 
        notes: 'Old notes', 
        status: 'open',
        userId: 1,
        warehouseId: 1,
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
        const updatedShift = { 
        ...shift, 
        notes: updateShiftDto.notes || null
      };

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);
      jest.spyOn(prismaService.shift, 'update').mockResolvedValue(updatedShift);

      const result = await service.update(id, updateShiftDto);

      expect(result).toEqual(updatedShift);
      expect(prismaService.shift.update).toHaveBeenCalledWith({
        where: { id },
        data: updateShiftDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  });
  describe('closeShift', () => {
    const id = 1;
    const userId = 1;
    const closeShiftDto: CloseShiftDto = {
      endAmount: 200,
      notes: 'Closed with extra cash',
    };

    it('should close a shift successfully', async () => {
      const shift = {
        id,
        userId,
        status: 'open',
        notes: 'Morning shift',
        warehouseId: 1,
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
        const closedShift = {
        ...shift,
        status: 'closed',
        endTime: expect.any(Date),
        endAmount: new Prisma.Decimal(closeShiftDto.endAmount),
        notes: closeShiftDto.notes || null,
      };

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);
      jest.spyOn(prismaService.shift, 'update').mockResolvedValue(closedShift);

      const result = await service.closeShift(id, closeShiftDto, userId);

      expect(result).toEqual(closedShift);
      expect(prismaService.shift.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          status: 'closed',
          endTime: expect.any(Date),
          endAmount: closeShiftDto.endAmount,
          notes: closeShiftDto.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
          warehouse: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });    it('should throw BadRequestException if shift is already closed', async () => {
      const shift = {
        id,
        userId,
        status: 'closed',
        warehouseId: 1,
        startTime: new Date(),
        endTime: new Date(),
        startAmount: new Prisma.Decimal(100),
        endAmount: new Prisma.Decimal(200),
        notes: 'Closed shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);

      await expect(service.closeShift(id, closeShiftDto, userId)).rejects.toThrow(
        BadRequestException,
      );
    });    it('should throw ForbiddenException if user does not own the shift', async () => {
      const shift = {
        id,
        userId: 999, // Different user ID
        status: 'open',
        warehouseId: 1,
        startTime: new Date(),
        endTime: null,
        startAmount: new Prisma.Decimal(100),
        endAmount: null,
        notes: 'Other user\'s shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);

      await expect(service.closeShift(id, closeShiftDto, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
  describe('getShiftSummary', () => {
    it('should return shift summary with calculations', async () => {
      const id = 1;
      const shift = {
        id,
        startAmount: new Prisma.Decimal(100),
        endAmount: new Prisma.Decimal(250),
        status: 'closed',
        userId: 1,
        warehouseId: 1,
        startTime: new Date(),
        endTime: new Date(),
        notes: 'Completed shift',
        createdAt: new Date(),
        updatedAt: new Date()
      };
        const invoices = [
        { 
          id: 1, 
          totalAmount: new Prisma.Decimal(50), 
          paidAmount: new Prisma.Decimal(50),
          status: 'completed',
          userId: 1,
          warehouseId: 1,
          notes: null,
          code: 'INV-001',
          customerId: 1,
          shiftId: 1,
          paymentMethod: 'cash',
          dueDate: null,
          invoiceDate: new Date(),
          issueDate: new Date(),
          discountAmount: new Prisma.Decimal(0),
          taxAmount: new Prisma.Decimal(0),
          subtotal: new Prisma.Decimal(50),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 2, 
          totalAmount: new Prisma.Decimal(75), 
          paidAmount: new Prisma.Decimal(75),
          status: 'completed',
          userId: 1,
          warehouseId: 1,
          notes: null,
          code: 'INV-002',
          customerId: 2,
          shiftId: 1,
          paymentMethod: 'cash',
          dueDate: null,
          invoiceDate: new Date(),
          issueDate: new Date(),
          discountAmount: new Prisma.Decimal(0),
          taxAmount: new Prisma.Decimal(0),
          subtotal: new Prisma.Decimal(75),
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      
      const transactions = [
        { 
          id: 1, 
          transactionType: 'receipt', 
          status: 'completed', 
          amount: new Prisma.Decimal(125),
          userId: 1,
          code: 'REC-001',
          transactionMethod: 'cash',
          transactionDate: new Date(),
          dueDate: null,
          category: 'sale',
          reference: null,
          customerId: 1,
          partnerId: null,
          invoiceId: 1,
          referenceType: null,
          referenceId: null,
          shiftId: 1,
          paymentMethod: 'cash',
          accountNumber: null,
          bankName: null,
          receiptNumber: null,
          attachments: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        { 
          id: 2, 
          transactionType: 'payment', 
          status: 'completed', 
          amount: new Prisma.Decimal(25),
          userId: 1,
          code: 'PAY-001',
          transactionMethod: 'cash',
          transactionDate: new Date(),
          dueDate: null,
          category: 'expense',
          reference: null,
          customerId: null,
          partnerId: 1,
          invoiceId: null,
          referenceType: null,
          referenceId: null,
          shiftId: 1,
          paymentMethod: 'cash',
          accountNumber: null,
          bankName: null,
          receiptNumber: null,
          attachments: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];

      jest.spyOn(prismaService.shift, 'findUnique').mockResolvedValue(shift);
      jest.spyOn(prismaService.invoice, 'findMany').mockResolvedValue(invoices);
      jest.spyOn(prismaService.transaction, 'findMany').mockResolvedValue(transactions);

      const result = await service.getShiftSummary(id);

      expect(result).toEqual({
        shift,
        invoices,
        transactions,
        summary: {
          totalSales: 125,
          totalReceived: 125,
          totalPaid: 25,
          calculatedBalance: 200, // 100 + 125 - 25
          declaredEndAmount: 250,
          difference: 50, // 250 - 200
        },
      });
    });
  });
});
