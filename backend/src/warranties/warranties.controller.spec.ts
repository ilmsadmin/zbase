import { Test, TestingModule } from '@nestjs/testing';
import { WarrantiesController } from './warranties.controller';
import { WarrantiesService } from './warranties.service';
import { CreateWarrantyDto } from './dto';

describe('WarrantiesController', () => {
  let controller: WarrantiesController;
  let service: WarrantiesService;

  const mockWarrantiesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarrantiesController],
      providers: [
        { provide: WarrantiesService, useValue: mockWarrantiesService },
      ],
    }).compile();    controller = module.get<WarrantiesController>(WarrantiesController);
    service = module.get<WarrantiesService>(WarrantiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a warranty', async () => {
      const dto: CreateWarrantyDto = {
        customerId: 1,
        productId: 1,
        creatorId: 1,
        issueDescription: 'Test issue',
      };
      
      const expectedResult = { id: 1, ...dto };
      mockWarrantiesService.create.mockResolvedValue(expectedResult);
      
      expect(await controller.create(dto)).toBe(expectedResult);
      expect(mockWarrantiesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all warranties', async () => {
      const warranties = [{ id: 1 }, { id: 2 }];
      mockWarrantiesService.findAll.mockResolvedValue(warranties);
      
      expect(await controller.findAll({})).toBe(warranties);
    });
  });

  describe('findOne', () => {
    it('should return a warranty by id', async () => {
      const warranty = { id: 1 };
      mockWarrantiesService.findOne.mockResolvedValue(warranty);
      
      expect(await controller.findOne(1)).toBe(warranty);
      expect(mockWarrantiesService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
