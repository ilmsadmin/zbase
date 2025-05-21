import { Test, TestingModule } from '@nestjs/testing';
import { WarehousesService } from './warehouses.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  warehouse: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('WarehousesService', () => {
  let service: WarehousesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehousesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WarehousesService>(WarehousesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      const warehouseData = { name: 'Test Warehouse', address: 'Test Address' };
      mockPrismaService.warehouse.create.mockResolvedValue({ id: 1, ...warehouseData });
      
      expect(await service.create(warehouseData)).toEqual({ id: 1, ...warehouseData });
      expect(mockPrismaService.warehouse.create).toHaveBeenCalledWith({
        data: warehouseData,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of warehouses', async () => {
      const warehouses = [{ id: 1, name: 'Test Warehouse' }];
      mockPrismaService.warehouse.findMany.mockResolvedValue(warehouses);
      
      expect(await service.findAll()).toEqual(warehouses);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      const warehouse = { id: 1, name: 'Test Warehouse' };
      mockPrismaService.warehouse.findUnique.mockResolvedValue(warehouse);
      
      expect(await service.findOne(1)).toEqual(warehouse);
    });

    it('should throw NotFoundException if warehouse not found', async () => {
      mockPrismaService.warehouse.findUnique.mockResolvedValue(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const warehouse = { id: 1, name: 'Updated Warehouse' };
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouse.update.mockResolvedValue(warehouse);
      
      expect(await service.update(1, { name: 'Updated Warehouse' })).toEqual(warehouse);
    });
  });

  describe('remove', () => {
    it('should delete a warehouse', async () => {
      const warehouse = { id: 1, name: 'Test Warehouse' };
      mockPrismaService.warehouse.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.warehouse.delete.mockResolvedValue(warehouse);
      
      expect(await service.remove(1)).toEqual(warehouse);
    });
  });
});
