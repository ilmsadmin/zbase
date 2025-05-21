import { Test, TestingModule } from '@nestjs/testing';
import { CustomerGroupsService } from './customer-groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerGroupDto } from './dto';

const mockPrismaService = {
  customerGroup: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  customer: {
    count: jest.fn(),
  },
  priceList: {
    count: jest.fn(),
  },
};

describe('CustomerGroupsService', () => {
  let service: CustomerGroupsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerGroupsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CustomerGroupsService>(CustomerGroupsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer group', async () => {
      const createCustomerGroupDto: CreateCustomerGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
        discountRate: 10,
      };

      const expectedGroup = {
        id: 1,
        ...createCustomerGroupDto,
        creditLimit: null,
        paymentTerms: null,
        priority: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.customerGroup.findFirst.mockResolvedValue(null);
      mockPrismaService.customerGroup.create.mockResolvedValue(expectedGroup);

      const result = await service.create(createCustomerGroupDto);

      expect(result).toEqual(expectedGroup);
      expect(mockPrismaService.customerGroup.create).toHaveBeenCalledWith({
        data: createCustomerGroupDto,
      });
    });

    it('should throw an error if group name already exists', async () => {
      const createCustomerGroupDto: CreateCustomerGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
      };

      mockPrismaService.customerGroup.findFirst.mockResolvedValue({ id: 1, name: 'Test Group' });

      await expect(service.create(createCustomerGroupDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all customer groups', async () => {
      const expectedGroups = [
        {
          id: 1,
          name: 'Group 1',
          description: 'Description 1',
          _count: {
            customers: 5,
          },
        },
        {
          id: 2,
          name: 'Group 2',
          description: 'Description 2',
          _count: {
            customers: 3,
          },
        },
      ];

      mockPrismaService.customerGroup.findMany.mockResolvedValue(expectedGroups);

      const result = await service.findAll();

      expect(result).toEqual(expectedGroups);
      expect(mockPrismaService.customerGroup.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer group by id', async () => {
      const expectedGroup = {
        id: 1,
        name: 'Group 1',
        description: 'Description 1',
        customers: [],
        priceLists: [],
        _count: {
          customers: 0,
        },
      };

      mockPrismaService.customerGroup.findUnique.mockResolvedValue(expectedGroup);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedGroup);
      expect(mockPrismaService.customerGroup.findUnique).toHaveBeenCalled();
    });

    it('should throw an error if customer group not found', async () => {
      mockPrismaService.customerGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer group', async () => {
      const expectedGroup = {
        id: 1,
        name: 'Group 1',
        description: 'Description 1',
      };

      mockPrismaService.customerGroup.findUnique.mockResolvedValue(expectedGroup);
      mockPrismaService.customer.count.mockResolvedValue(0);
      mockPrismaService.priceList.count.mockResolvedValue(0);
      mockPrismaService.customerGroup.delete.mockResolvedValue(expectedGroup);

      const result = await service.remove(1);

      expect(result).toEqual(expectedGroup);
      expect(mockPrismaService.customerGroup.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if customer group not found', async () => {
      mockPrismaService.customerGroup.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if customer group has customers', async () => {
      mockPrismaService.customerGroup.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.customer.count.mockResolvedValue(5);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
