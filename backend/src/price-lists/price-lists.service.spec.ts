import { Test, TestingModule } from '@nestjs/testing';
import { PriceListsService } from './price-lists.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePriceListDto, UpdatePriceListDto, AddPriceListItemDto, UpdatePriceListItemDto } from './dto';

describe('PriceListsService', () => {
  let service: PriceListsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceListsService,
        {
          provide: PrismaService,
          useValue: {
            priceList: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              delete: jest.fn(),
            },
            priceListItem: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            customerGroup: {
              findUnique: jest.fn(),
            },
            customer: {
              findUnique: jest.fn(),
            },
            product: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PriceListsService>(PriceListsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createPriceListDto: CreatePriceListDto = {
      name: 'Standard Price List',
      code: 'STD-PL-001',
      customerGroupId: 1,
      isDefault: true,
    };    // Create proper mock objects matching the schema
    const customerGroup = { 
      id: 1, 
      name: 'Regular Customers',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentTerms: 30,
      discountRate: new Prisma.Decimal(5),
      creditLimit: new Prisma.Decimal(10000),
      priority: 1
    };
    
    const createdPriceList = {
      id: 1,
      name: createPriceListDto.name,
      code: createPriceListDto.code,
      description: null,
      customerGroupId: createPriceListDto.customerGroupId,
      startDate: null,
      endDate: null,
      priority: 0,
      discountType: 'percentage',
      status: 'active',
      applicableOn: 'all',
      isDefault: createPriceListDto.isDefault || false,
      createdBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerGroup
    };

    it('should create a price list successfully', async () => {
      jest.spyOn(prismaService.customerGroup, 'findUnique').mockResolvedValue(customerGroup);
      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.priceList, 'updateMany').mockResolvedValue({ count: 0 });
      jest.spyOn(prismaService.priceList, 'create').mockResolvedValue(createdPriceList);

      const result = await service.create(createPriceListDto);

      expect(result).toEqual(createdPriceList);
      expect(prismaService.customerGroup.findUnique).toHaveBeenCalledWith({
        where: { id: createPriceListDto.customerGroupId },
      });
      expect(prismaService.priceList.updateMany).toHaveBeenCalledWith({
        where: {
          customerGroupId: createPriceListDto.customerGroupId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    });

    it('should throw NotFoundException if customer group does not exist', async () => {
      jest.spyOn(prismaService.customerGroup, 'findUnique').mockResolvedValue(null);

      await expect(service.create(createPriceListDto)).rejects.toThrow(
        NotFoundException,
      );
    });    it('should throw ConflictException if code already exists', async () => {
      jest.spyOn(prismaService.customerGroup, 'findUnique').mockResolvedValue(customerGroup);
      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue({
        id: 2,
        name: 'Existing Price List',
        code: createPriceListDto.code,
        description: null,
        customerGroupId: 2,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: false,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(service.create(createPriceListDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
  describe('findAll', () => {
    it('should return price lists with pagination', async () => {
      const priceLists = [
        {
          id: 1,
          name: 'Standard Price List',
          code: 'STD-PL-001',
          description: null,
          customerGroupId: 1,
          startDate: null,
          endDate: null,
          priority: 0,
          discountType: 'percentage',
          status: 'active',
          applicableOn: 'all',
          isDefault: true,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Premium Price List',
          code: 'PRM-PL-001',
          description: null,
          customerGroupId: 2,
          startDate: null,
          endDate: null,
          priority: 0,
          discountType: 'percentage',
          status: 'active',
          applicableOn: 'all',
          isDefault: true,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ];
      const count = 2;
      const page = 1;
      const limit = 10;

      jest.spyOn(prismaService.priceList, 'findMany').mockResolvedValue(priceLists);
      jest.spyOn(prismaService.priceList, 'count').mockResolvedValue(count);

      const result = await service.findAll('standard', 'active', 1, page, limit);

      expect(result).toEqual({
        items: priceLists,
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
    it('should return a price list by id', async () => {
      const id = 1;
      const priceList = {
        id,
        name: 'Standard Price List',
        code: 'STD-PL-001',
        description: null,
        customerGroupId: 1,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: true,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(priceList);

      const result = await service.findOne(id);

      expect(result).toEqual(priceList);
      expect(prismaService.priceList.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          customerGroup: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              items: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if price list not found', async () => {
      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    const id = 1;
    const updatePriceListDto: UpdatePriceListDto = {
      name: 'Updated Standard Price List',
      code: 'STD-PL-001-UPD',
    };
    
    it('should update a price list', async () => {      const originalPriceList = {
        id,
        name: 'Standard Price List',
        code: 'STD-PL-001',
        description: null,
        customerGroupId: 1,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: true,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const updatedPriceList = {
        id: originalPriceList.id,
        name: updatePriceListDto.name || originalPriceList.name,
        code: updatePriceListDto.code || originalPriceList.code,
        description: originalPriceList.description,
        customerGroupId: originalPriceList.customerGroupId,
        startDate: originalPriceList.startDate,
        endDate: originalPriceList.endDate,
        priority: originalPriceList.priority,
        discountType: originalPriceList.discountType,
        status: originalPriceList.status,
        applicableOn: originalPriceList.applicableOn,
        isDefault: originalPriceList.isDefault,
        createdBy: originalPriceList.createdBy,
        createdAt: originalPriceList.createdAt,
        updatedAt: originalPriceList.updatedAt
      };

      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(originalPriceList);
      jest.spyOn(prismaService.priceList, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.priceList, 'update').mockResolvedValue(updatedPriceList);

      const result = await service.update(id, updatePriceListDto);

      expect(result).toEqual(updatedPriceList);
      expect(prismaService.priceList.update).toHaveBeenCalledWith({
        where: { id },
        data: updatePriceListDto,
        include: {
          customerGroup: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  });  describe('addPriceListItem', () => {
    const id = 1;
    const addPriceListItemDto: AddPriceListItemDto = {
      productId: 1,
      price: 100,
    };
      it('should add an item to a price list', async () => {
      const priceList = {
        id,
        name: 'Standard Price List',
        code: 'STD-PL-001',
        description: null,
        customerGroupId: 1,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: true,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const product = {
        id: 1,
        name: 'Product 1',
        code: 'PROD-001',
        description: null,
        categoryId: null,
        basePrice: new Prisma.Decimal(90),
        costPrice: new Prisma.Decimal(70),
        unit: 'piece',
        barcode: null,
        sku: 'SKU001',
        minStock: new Prisma.Decimal(10),
        isActive: true,
        warrantyMonths: 12,
        taxRate: new Prisma.Decimal(10),
        manufacturer: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const createdItem = { 
        id: 1, 
        priceListId: id,
        productId: 1,
        price: new Prisma.Decimal(100),
        minQuantity: new Prisma.Decimal(1),
        maxQuantity: null,
        discountType: 'percentage',
        discountValue: new Prisma.Decimal(0),
        discountRate: new Prisma.Decimal(0),
        specialConditions: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 1, 
          name: 'Product 1', 
          code: 'PROD-001', 
          basePrice: new Prisma.Decimal(90)
        },
      };

      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(priceList);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(product);
      jest.spyOn(prismaService.priceListItem, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.priceListItem, 'create').mockResolvedValue(createdItem);

      const result = await service.addPriceListItem(id, addPriceListItemDto);

      expect(result).toEqual(createdItem);
    });    it('should throw NotFoundException if product does not exist', async () => {
      const priceList = {
        id, 
        name: 'Standard Price List',
        code: 'STD-PL-001',
        description: null,
        customerGroupId: 1,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: true,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(priceList);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.addPriceListItem(id, addPriceListItemDto)).rejects.toThrow(
        NotFoundException,
      );
    });    it('should throw ConflictException if product already exists with same min quantity', async () => {
      const priceList = {
        id,
        name: 'Standard Price List',
        code: 'STD-PL-001',
        description: null,
        customerGroupId: 1,
        startDate: null,
        endDate: null,
        priority: 0,
        discountType: 'percentage',
        status: 'active',
        applicableOn: 'all',
        isDefault: true,
        createdBy: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
        const product = {
        id: 1,
        name: 'Product 1',
        code: 'PROD-001',
        description: null,
        categoryId: null,
        basePrice: new Prisma.Decimal(90),
        costPrice: new Prisma.Decimal(70),
        unit: 'piece',
        barcode: null,
        sku: 'SKU001',
        minStock: new Prisma.Decimal(10),
        isActive: true,
        warrantyMonths: 12,
        taxRate: new Prisma.Decimal(10),
        manufacturer: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const existingItem = {
        id: 2,
        priceListId: id,
        productId: 1,
        price: new Prisma.Decimal(100),
        minQuantity: new Prisma.Decimal(1),
        maxQuantity: null,
        discountType: 'percentage',
        discountValue: new Prisma.Decimal(0),
        discountRate: new Prisma.Decimal(0),
        specialConditions: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      jest.spyOn(prismaService.priceList, 'findUnique').mockResolvedValue(priceList);
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(product);
      jest.spyOn(prismaService.priceListItem, 'findFirst').mockResolvedValue(existingItem);

      await expect(service.addPriceListItem(id, addPriceListItemDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
  describe('getPriceListForCustomer', () => {
    it('should return the appropriate price list for a customer', async () => {
      const customerId = 1;
      const customer = { 
        id: customerId, 
        name: 'John Doe',
        code: 'CUST001',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St',
        taxCode: null, 
        groupId: 1,
        creditBalance: new Prisma.Decimal(0),
        createdAt: new Date(),
        updatedAt: new Date(),
        group: { 
          id: 1, 
          name: 'Regular Customers',
          description: null,
          paymentTerms: 30,
          discountRate: new Prisma.Decimal(5),
          creditLimit: new Prisma.Decimal(10000),
          priority: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        } 
      };
      
      const priceLists = [
        {
          id: 1,
          name: 'Standard Price List',
          code: 'STD-PL-001',
          description: null,
          customerGroupId: 1,
          startDate: null,
          endDate: null,
          priority: 0,
          discountType: 'percentage',
          status: 'active',
          applicableOn: 'all',
          isDefault: true,
          createdBy: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          items: []
        },
      ];

      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer);
      jest.spyOn(prismaService.priceList, 'findMany').mockResolvedValue(priceLists);

      const result = await service.getPriceListForCustomer(customerId);

      expect(result).toEqual(priceLists[0]);
    });    it('should return null if customer has no group', async () => {
      const customerId = 1;
      const customer = { 
        id: customerId, 
        name: 'John Doe',
        code: 'CUST001',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St',
        taxCode: null, 
        groupId: null,
        creditBalance: new Prisma.Decimal(0),
        createdAt: new Date(),
        updatedAt: new Date(),
        group: null
      };

      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer);

      const result = await service.getPriceListForCustomer(customerId);

      expect(result).toBeNull();
    });    it('should return null if no price lists found for customer group', async () => {
      const customerId = 1;
      const customer = { 
        id: customerId, 
        name: 'John Doe',
        code: 'CUST001',
        phone: '1234567890',
        email: 'john.doe@example.com',
        address: '123 Main St',
        taxCode: null, 
        groupId: 1,
        creditBalance: new Prisma.Decimal(0),
        createdAt: new Date(),
        updatedAt: new Date(),
        group: { 
          id: 1, 
          name: 'Regular Customers',
          description: null,
          paymentTerms: 30,
          discountRate: new Prisma.Decimal(5),
          creditLimit: new Prisma.Decimal(10000),
          priority: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        } 
      };

      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(customer);
      jest.spyOn(prismaService.priceList, 'findMany').mockResolvedValue([]);

      const result = await service.getPriceListForCustomer(customerId);

      expect(result).toBeNull();
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(null);

      await expect(service.getPriceListForCustomer(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
