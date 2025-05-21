import { Test, TestingModule } from '@nestjs/testing';
import { ProductAttributesController } from './product-attributes.controller';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';

// Mock AuthGuard and PermissionsGuard
jest.mock('../auth/guards/jwt-auth.guard');
jest.mock('../permissions/permissions.guard');

const mockProductAttributesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  bulkCreate: jest.fn(),
  removeAllForProduct: jest.fn(),
};

describe('ProductAttributesController', () => {
  let controller: ProductAttributesController;
  let service: ProductAttributesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAttributesController],
      providers: [
        {
          provide: ProductAttributesService,
          useValue: mockProductAttributesService,
        },
      ],
    }).compile();

    controller = module.get<ProductAttributesController>(ProductAttributesController);
    service = module.get<ProductAttributesService>(ProductAttributesService);
    
    jest.clearAllMocks();
    
    // Mock the guards to always return true
    (JwtAuthGuard as jest.Mock).mockImplementation(() => ({
      canActivate: () => true,
    }));
    
    (PermissionsGuard as jest.Mock).mockImplementation(() => ({
      canActivate: () => true,
    }));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product attribute', async () => {
      // Arrange
      const createDto: CreateProductAttributeDto = {
        productId: 1,
        attributeName: 'Color',
        attributeValue: 'Red',
      };
      
      const expectedResult = { id: 1, ...createDto };
      mockProductAttributesService.create.mockResolvedValue(expectedResult);
      
      // Act
      const result = await controller.create(createDto);
      
      // Assert
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('bulkCreate', () => {
    it('should create multiple product attributes', async () => {
      // Arrange
      const attributes = [
        { productId: 1, attributeName: 'Color', attributeValue: 'Red' },
        { productId: 1, attributeName: 'Size', attributeValue: 'Large' },
      ];
      
      const expectedResult = { count: 2 };
      mockProductAttributesService.bulkCreate.mockResolvedValue(expectedResult);
      
      // Act
      const result = await controller.bulkCreate(attributes);
      
      // Assert
      expect(service.bulkCreate).toHaveBeenCalledWith(attributes);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all attributes when no productId is provided', async () => {
      // Arrange
      const expectedResult = [
        { id: 1, productId: 1, attributeName: 'Color', attributeValue: 'Red' },
        { id: 2, productId: 2, attributeName: 'Size', attributeValue: 'Large' },
      ];
      mockProductAttributesService.findAll.mockResolvedValue(expectedResult);
      
      // Act
      const result = await controller.findAll();
      
      // Assert
      expect(service.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(expectedResult);
    });
    
    it('should return attributes for specific product when productId is provided', async () => {
      // Arrange
      const productId = '1';
      const expectedResult = [
        { id: 1, productId: 1, attributeName: 'Color', attributeValue: 'Red' },
        { id: 2, productId: 1, attributeName: 'Size', attributeValue: 'Large' },
      ];
      mockProductAttributesService.findAll.mockResolvedValue(expectedResult);
      
      // Act
      const result = await controller.findAll(productId);
      
      // Assert
      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedResult);
    });
  });

  // Add more test cases for other controller methods...
});
