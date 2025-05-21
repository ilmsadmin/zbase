import { Test, TestingModule } from '@nestjs/testing';
import { CustomerGroupsController } from './customer-groups.controller';
import { CustomerGroupsService } from './customer-groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { CreateCustomerGroupDto, UpdateCustomerGroupDto } from './dto';

const mockCustomerGroupsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CustomerGroupsController', () => {
  let controller: CustomerGroupsController;
  let service: CustomerGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerGroupsController],
      providers: [{ provide: CustomerGroupsService, useValue: mockCustomerGroupsService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CustomerGroupsController>(CustomerGroupsController);
    service = module.get<CustomerGroupsService>(CustomerGroupsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct parameters', async () => {
      const createCustomerGroupDto: CreateCustomerGroupDto = {
        name: 'Test Group',
        description: 'Test Description',
      };
      const expectedResult = { id: 1, ...createCustomerGroupDto };
      
      mockCustomerGroupsService.create.mockResolvedValue(expectedResult);
      
      const result = await controller.create(createCustomerGroupDto);
      
      expect(service.create).toHaveBeenCalledWith(createCustomerGroupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const expectedResult = [{ id: 1, name: 'Group 1' }];
      
      mockCustomerGroupsService.findAll.mockResolvedValue(expectedResult);
      
      const result = await controller.findAll('search');
      
      expect(service.findAll).toHaveBeenCalledWith('search');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Test Group' };
      
      mockCustomerGroupsService.findOne.mockResolvedValue(expectedResult);
      
      const result = await controller.findOne(id);
      
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const id = 1;
      const updateCustomerGroupDto: UpdateCustomerGroupDto = { name: 'Updated Group' };
      const expectedResult = { id, ...updateCustomerGroupDto };
      
      mockCustomerGroupsService.update.mockResolvedValue(expectedResult);
      
      const result = await controller.update(id, updateCustomerGroupDto);
      
      expect(service.update).toHaveBeenCalledWith(id, updateCustomerGroupDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Test Group' };
      
      mockCustomerGroupsService.remove.mockResolvedValue(expectedResult);
      
      const result = await controller.remove(id);
      
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});
