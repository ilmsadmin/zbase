import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransactionType, TransactionMethod } from './dto/create-transaction.dto';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    transaction: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
    },
    partner: {
      findUnique: jest.fn(),
    },
    invoice: {
      findUnique: jest.fn(),
    },
    shift: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();    service = module.get<TransactionsService>(TransactionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {    it('should create a transaction successfully', async () => {      const dto = {
        transactionType: TransactionType.RECEIPT,
        transactionMethod: TransactionMethod.CASH,
        amount: 100,
        userId: 1,
      };
      
      mockPrismaService.transaction.count.mockResolvedValue(5);
      mockPrismaService.transaction.create.mockResolvedValue({ id: 1, ...dto, code: 'REC-20250521-0006' });
      
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.code).toContain('REC-20250521');
      expect(mockPrismaService.transaction.create).toHaveBeenCalled();
    });
      it('should throw an error if customer not found', async () => {
      const dto = {
        transactionType: TransactionType.RECEIPT,
        transactionMethod: TransactionMethod.CASH,
        amount: 100,
        userId: 1,
        customerId: 999,
      };
      
      mockPrismaService.transaction.count.mockResolvedValue(5);
      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions = [{ id: 1 }, { id: 2 }];
      mockPrismaService.transaction.findMany.mockResolvedValue(transactions);
      
      const result = await service.findAll({});
      expect(result).toEqual(transactions);
      expect(mockPrismaService.transaction.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const transaction = { id: 1 };
      mockPrismaService.transaction.findUnique.mockResolvedValue(transaction);
      
      const result = await service.findOne(1);
      expect(result).toEqual(transaction);
    });
    
    it('should throw an error if transaction not found', async () => {
      mockPrismaService.transaction.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
