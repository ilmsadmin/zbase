import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateCustomerDto, UpdateCustomerDto } from './dto';

const mockCustomersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [{ provide: CustomersService, useValue: mockCustomersService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        phone: '1234567890',
      };
      const expectedResult = { id: 1, ...createCustomerDto };
      
      mockCustomersService.create.mockResolvedValue(expectedResult);
      
      const result = await controller.create(createCustomerDto);
      
      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const expectedResult = {
        items: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      };
      
      mockCustomersService.findAll.mockResolvedValue(expectedResult);
      
      const result = await controller.findAll('1', 'search', 1, 20);
      
      expect(service.findAll).toHaveBeenCalledWith(1, 'search', 1, 20);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Test Customer' };
      
      mockCustomersService.findOne.mockResolvedValue(expectedResult);
      
      const result = await controller.findOne(id);
      
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = 1;
      const updateCustomerDto: UpdateCustomerDto = { name: 'Updated Customer' };
      const expectedResult = { id, ...updateCustomerDto };
      
      mockCustomersService.update.mockResolvedValue(expectedResult);
      
      const result = await controller.update(id, updateCustomerDto);
      
      expect(service.update).toHaveBeenCalledWith(id, updateCustomerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Test Customer' };
      
      mockCustomersService.remove.mockResolvedValue(expectedResult);
      
      const result = await controller.remove(id);
      
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});
