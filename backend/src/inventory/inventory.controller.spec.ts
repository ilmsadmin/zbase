import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateInventoryDto, CreateInventoryTransactionDto } from './dto';

const mockInventoryService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createTransaction: jest.fn(),
  getTransactions: jest.fn(),
  getTransactionById: jest.fn(),
};

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [{ provide: InventoryService, useValue: mockInventoryService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createInventoryDto: CreateInventoryDto = {
        productId: 1,
        warehouseId: 1,
        quantity: 10,
        minStockLevel: 5,
      };
      const expectedResult = { id: 1, ...createInventoryDto };
      
      mockInventoryService.create.mockResolvedValue(expectedResult);
      
      const result = await controller.create(createInventoryDto);
      
      expect(service.create).toHaveBeenCalledWith(createInventoryDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const expectedResult = {
        items: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      };
      
      mockInventoryService.findAll.mockResolvedValue(expectedResult);
      
      const result = await controller.findAll('1', '1', '1', false, 1, 20);
      
      expect(service.findAll).toHaveBeenCalledWith(1, 1, 1, false, 1, 20);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const id = 1;
      const expectedResult = { id, productId: 1, warehouseId: 1, quantity: 10 };
      
      mockInventoryService.findOne.mockResolvedValue(expectedResult);
      
      const result = await controller.findOne(id);
      
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createTransaction', () => {
    it('should call service.createTransaction with correct parameters', async () => {
      const createTransactionDto: CreateInventoryTransactionDto = {
        productId: 1,
        warehouseId: 1,
        transactionType: 'in',
        quantity: 5,
      };
      const expectedResult = { id: 1, ...createTransactionDto };
      
      mockInventoryService.createTransaction.mockResolvedValue(expectedResult);
      
      const result = await controller.createTransaction(createTransactionDto);
      
      expect(service.createTransaction).toHaveBeenCalledWith(createTransactionDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
