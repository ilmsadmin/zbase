import { Test, TestingModule } from '@nestjs/testing';
import { PriceListsController } from './price-lists.controller';
import { PriceListsService } from './price-lists.service';
import { 
  CreatePriceListDto,
  UpdatePriceListDto,
  AddPriceListItemDto,
  UpdatePriceListItemDto
} from './dto';

describe('PriceListsController', () => {
  let controller: PriceListsController;
  let service: PriceListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceListsController],
      providers: [
        {
          provide: PriceListsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            addPriceListItem: jest.fn(),
            findAllItems: jest.fn(),
            updatePriceListItem: jest.fn(),
            removePriceListItem: jest.fn(),
            setAsDefault: jest.fn(),
            getPriceListForCustomer: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PriceListsController>(PriceListsController);
    service = module.get<PriceListsService>(PriceListsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a price list', async () => {
      const createPriceListDto: CreatePriceListDto = {
        name: 'Standard Price List',
        code: 'STD-PL-001',
        customerGroupId: 1,
      };
      const expectedResult = { id: 1, ...createPriceListDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createPriceListDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createPriceListDto);
    });
  });

  describe('findAll', () => {
    it('should find all price lists with filters', async () => {
      const search = 'standard';
      const status = 'active';
      const customerGroupId = 1;
      const page = 1;
      const limit = 10;
      const expectedResult = {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll(search, status, customerGroupId, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(search, status, customerGroupId, page, limit);
    });
  });

  describe('findOne', () => {
    it('should find one price list by id', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Standard Price List' };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a price list', async () => {
      const id = 1;
      const updatePriceListDto: UpdatePriceListDto = {
        name: 'Updated Standard Price List',
      };
      const expectedResult = { id, ...updatePriceListDto };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(id, updatePriceListDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updatePriceListDto);
    });
  });

  describe('remove', () => {
    it('should remove a price list', async () => {
      const id = 1;
      const expectedResult = { id, name: 'Standard Price List' };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult as any);

      const result = await controller.remove(id);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('addPriceListItem', () => {
    it('should add an item to a price list', async () => {
      const id = 1;
      const addPriceListItemDto: AddPriceListItemDto = {
        productId: 1,
        price: 100,
      };
      const expectedResult = { id: 1, priceListId: id, ...addPriceListItemDto };

      jest.spyOn(service, 'addPriceListItem').mockResolvedValue(expectedResult as any);

      const result = await controller.addPriceListItem(id, addPriceListItemDto);

      expect(result).toEqual(expectedResult);
      expect(service.addPriceListItem).toHaveBeenCalledWith(id, addPriceListItemDto);
    });
  });

  describe('findAllItems', () => {
    it('should find all items in a price list', async () => {
      const id = 1;
      const page = 1;
      const limit = 50;
      const expectedResult = {
        items: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };

      jest.spyOn(service, 'findAllItems').mockResolvedValue(expectedResult);

      const result = await controller.findAllItems(id, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.findAllItems).toHaveBeenCalledWith(id, page, limit);
    });
  });

  describe('updatePriceListItem', () => {
    it('should update a price list item', async () => {
      const id = 1;
      const itemId = 1;
      const updatePriceListItemDto: UpdatePriceListItemDto = {
        price: 150,
      };
      const expectedResult = { id: itemId, priceListId: id, ...updatePriceListItemDto };

      jest.spyOn(service, 'updatePriceListItem').mockResolvedValue(expectedResult as any);

      const result = await controller.updatePriceListItem(id, itemId, updatePriceListItemDto);

      expect(result).toEqual(expectedResult);
      expect(service.updatePriceListItem).toHaveBeenCalledWith(id, itemId, updatePriceListItemDto);
    });
  });

  describe('removePriceListItem', () => {
    it('should remove a price list item', async () => {
      const id = 1;
      const itemId = 1;
      const expectedResult = { id: itemId, priceListId: id };

      jest.spyOn(service, 'removePriceListItem').mockResolvedValue(expectedResult as any);

      const result = await controller.removePriceListItem(id, itemId);

      expect(result).toEqual(expectedResult);
      expect(service.removePriceListItem).toHaveBeenCalledWith(id, itemId);
    });
  });

  describe('setAsDefault', () => {
    it('should set a price list as default', async () => {
      const id = 1;
      const expectedResult = { id, isDefault: true };

      jest.spyOn(service, 'setAsDefault').mockResolvedValue(expectedResult as any);

      const result = await controller.setAsDefault(id);

      expect(result).toEqual(expectedResult);
      expect(service.setAsDefault).toHaveBeenCalledWith(id);
    });
  });

  describe('getPriceListForCustomer', () => {
    it('should get a price list for a customer', async () => {
      const customerId = 1;
      const expectedResult = { id: 1, name: 'Standard Price List' };

      jest.spyOn(service, 'getPriceListForCustomer').mockResolvedValue(expectedResult as any);

      const result = await controller.getPriceListForCustomer(customerId);

      expect(result).toEqual(expectedResult);
      expect(service.getPriceListForCustomer).toHaveBeenCalledWith(customerId);
    });
  });
});
