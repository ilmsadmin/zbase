import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerDto } from './dto';

const mockPrismaService = {
  customer: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  customerGroup: {
    findUnique: jest.fn(),
  },
  invoice: {
    count: jest.fn(),
  },
  transaction: {
    count: jest.fn(),
  },
  warranty: {
    count: jest.fn(),
  },
};

describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        phone: '1234567890',
        email: 'test@example.com',
      };

      const expectedCustomer = {
        id: 1,
        ...createCustomerDto,
        code: null,
        address: null,
        taxCode: null,
        groupId: null,
        creditBalance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.customer.create.mockResolvedValue(expectedCustomer);

      const result = await service.create(createCustomerDto);

      expect(result).toEqual(expectedCustomer);
      expect(mockPrismaService.customer.create).toHaveBeenCalledWith({
        data: createCustomerDto,
      });
    });

    it('should throw an error if customer code already exists', async () => {
      const createCustomerDto: CreateCustomerDto = {
        code: 'CUST001',
        name: 'Test Customer',
      };

      mockPrismaService.customer.findUnique.mockResolvedValue({ id: 1, code: 'CUST001' });

      await expect(service.create(createCustomerDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if customer group does not exist', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        groupId: 999,
      };

      mockPrismaService.customer.findUnique.mockResolvedValue(null);
      mockPrismaService.customerGroup.findUnique.mockResolvedValue(null);

      await expect(service.create(createCustomerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const expectedCustomers = [
        {
          id: 1,
          name: 'Customer 1',
          code: 'CUST001',
          phone: '1234567890',
          email: 'customer1@example.com',
          group: {
            id: 1,
            name: 'Group 1',
            discountRate: 10,
          },
        },
      ];
      const totalCount = 1;

      mockPrismaService.customer.findMany.mockResolvedValue(expectedCustomers);
      mockPrismaService.customer.count.mockResolvedValue(totalCount);

      const result = await service.findAll(1, 'search', 1, 10);

      expect(result).toEqual({
        items: expectedCustomers,
        meta: {
          page: 1,
          limit: 10,
          total: totalCount,
          pages: 1,
        },
      });
      expect(mockPrismaService.customer.findMany).toHaveBeenCalled();
      expect(mockPrismaService.customer.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const expectedCustomer = {
        id: 1,
        name: 'Customer 1',
        group: { id: 1, name: 'Group 1' },
        invoices: [],
        transactions: [],
      };

      mockPrismaService.customer.findUnique.mockResolvedValue(expectedCustomer);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedCustomer);
      expect(mockPrismaService.customer.findUnique).toHaveBeenCalled();
    });

    it('should throw an error if customer not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a customer', async () => {
      const expectedCustomer = { id: 1, name: 'Customer 1' };
      
      mockPrismaService.customer.findUnique.mockResolvedValue(expectedCustomer);
      mockPrismaService.invoice.count.mockResolvedValue(0);
      mockPrismaService.transaction.count.mockResolvedValue(0);
      mockPrismaService.warranty.count.mockResolvedValue(0);
      mockPrismaService.customer.delete.mockResolvedValue(expectedCustomer);

      const result = await service.remove(1);

      expect(result).toEqual(expectedCustomer);
      expect(mockPrismaService.customer.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if customer not found', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if customer has related invoices', async () => {
      mockPrismaService.customer.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.invoice.count.mockResolvedValue(1);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
