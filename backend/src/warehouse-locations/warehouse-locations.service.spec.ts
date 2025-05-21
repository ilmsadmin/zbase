import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseLocationsService } from './warehouse-locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockPrismaService = {
  warehouse: {
    findUnique: jest.fn(),
  },
  warehouseLocation: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('WarehouseLocationsService', () => {
  let service: WarehouseLocationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseLocationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WarehouseLocationsService>(WarehouseLocationsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      warehouseId: 1,
      zone: 'A',
      aisle: '1',
      rack: '2',
      shelf: '3',
      position: '4',
    };

    it('should create a warehouse location', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouseLocation.findFirst.mockResolvedValue(null);
      mockPrismaService.warehouseLocation.create.mockResolvedValue({
        id: 1,
        ...createDto,
      });

      expect(await service.create(createDto)).toEqual({
        id: 1,
        ...createDto,
      });

      expect(mockPrismaService.warehouse.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException if warehouse does not exist', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if location with same coordinates exists', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouseLocation.findFirst.mockResolvedValue({
        id: 2,
        ...createDto,
      });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all locations when no warehouseId provided', async () => {
      const locations = [{ id: 1, zone: 'A' }, { id: 2, zone: 'B' }];
      mockPrismaService.warehouseLocation.findMany.mockResolvedValue(locations);

      expect(await service.findAll()).toEqual(locations);
      expect(mockPrismaService.warehouseLocation.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
      });
    });

    it('should filter by warehouseId when provided', async () => {
      const locations = [{ id: 1, zone: 'A', warehouseId: 1 }];
      mockPrismaService.warehouseLocation.findMany.mockResolvedValue(locations);

      expect(await service.findAll(1)).toEqual(locations);
      expect(mockPrismaService.warehouseLocation.findMany).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
        include: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return a location by id', async () => {
      const location = { id: 1, zone: 'A' };
      mockPrismaService.warehouseLocation.findUnique.mockResolvedValue(location);

      expect(await service.findOne(1)).toEqual(location);
    });

    it('should throw NotFoundException if location not found', async () => {
      mockPrismaService.warehouseLocation.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
