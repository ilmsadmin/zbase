import { Test, TestingModule } from '@nestjs/testing';
import { WarrantiesService } from './warranties.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WarrantyStatus } from './dto';

describe('WarrantiesService', () => {
  let service: WarrantiesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    warranty: {
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
    product: {
      findUnique: jest.fn(),
    },
    invoice: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarrantiesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();    service = module.get<WarrantiesService>(WarrantiesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a warranty successfully', async () => {
      const dto = {
        customerId: 1,
        productId: 1,
        creatorId: 1,
      };
      
      // Setup mocks
      mockPrismaService.warranty.count.mockResolvedValue(5);
      mockPrismaService.customer.findUnique.mockResolvedValue({ id: 1, name: 'Test Customer' });
      mockPrismaService.product.findUnique.mockResolvedValue({ id: 1, name: 'Test Product' });
      
      mockPrismaService.warranty.create.mockResolvedValue({ 
        id: 1, 
        ...dto, 
        code: 'WR-20250521-0006',
        status: WarrantyStatus.PENDING
      });
      
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.code).toContain('WR-20250521');
      expect(mockPrismaService.warranty.create).toHaveBeenCalled();
    });
    
    it('should throw an error if customer not found', async () => {
      const dto = {
        customerId: 999,
        productId: 1,
        creatorId: 1,
      };
      
      mockPrismaService.warranty.count.mockResolvedValue(5);
      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all warranties', async () => {
      const warranties = [{ id: 1 }, { id: 2 }];
      mockPrismaService.warranty.findMany.mockResolvedValue(warranties);
      
      const result = await service.findAll({});
      expect(result).toEqual(warranties);
    });
  });

  describe('findOne', () => {
    it('should return a warranty by id', async () => {
      const warranty = { id: 1 };
      mockPrismaService.warranty.findUnique.mockResolvedValue(warranty);
      
      const result = await service.findOne(1);
      expect(result).toEqual(warranty);
    });
    
    it('should throw an error if warranty not found', async () => {
      mockPrismaService.warranty.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
