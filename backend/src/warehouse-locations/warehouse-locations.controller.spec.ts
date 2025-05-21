import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseLocationsController } from './warehouse-locations.controller';

describe('WarehouseLocationsController', () => {
  let controller: WarehouseLocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseLocationsController],
    }).compile();

    controller = module.get<WarehouseLocationsController>(WarehouseLocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
