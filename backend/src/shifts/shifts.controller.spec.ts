import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateShiftDto, UpdateShiftDto, CloseShiftDto } from './dto';

describe('ShiftsController', () => {
  let controller: ShiftsController;
  let service: ShiftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [
        {
          provide: ShiftsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findCurrentShift: jest.fn(),
            update: jest.fn(),
            closeShift: jest.fn(),
            getShiftSummary: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
    service = module.get<ShiftsService>(ShiftsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a shift', async () => {
      const createShiftDto: CreateShiftDto = {
        warehouseId: 1,
        startAmount: 100,
        notes: 'Morning shift',
      };
      const userId = 1;
      const expectedResult = { id: 1, ...createShiftDto, userId };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(createShiftDto, userId);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createShiftDto, userId);
    });
  });

  describe('findAll', () => {
    it('should find all shifts with filters', async () => {
      const status = 'open';
      const warehouseId = 1;
      const userId = 1;
      const page = 1;
      const limit = 10;
      const expectedResult = {
        items: [{ id: 1, status, warehouseId, userId }],
        meta: { total: 1, page, limit, totalPages: 1 },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(status, warehouseId, userId, page, limit);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(status, warehouseId, userId, page, limit);
    });
  });

  describe('findCurrent', () => {
    it('should find current shift for user', async () => {
      const userId = 1;
      const expectedResult = { id: 1, userId, status: 'open' };

      jest.spyOn(service, 'findCurrentShift').mockResolvedValue(expectedResult as any);

      const result = await controller.findCurrent(userId);

      expect(result).toEqual(expectedResult);
      expect(service.findCurrentShift).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should find one shift by id', async () => {
      const id = 1;
      const expectedResult = { id, status: 'open' };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a shift', async () => {
      const id = 1;
      const updateShiftDto: UpdateShiftDto = {
        notes: 'Updated notes',
      };
      const expectedResult = { id, ...updateShiftDto };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(id, updateShiftDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateShiftDto);
    });
  });

  describe('closeShift', () => {
    it('should close a shift', async () => {
      const id = 1;
      const closeShiftDto: CloseShiftDto = {
        endAmount: 200,
        notes: 'Closed with extra cash',
      };
      const userId = 1;
      const expectedResult = { id, status: 'closed', ...closeShiftDto };

      jest.spyOn(service, 'closeShift').mockResolvedValue(expectedResult as any);

      const result = await controller.closeShift(id, closeShiftDto, userId);

      expect(result).toEqual(expectedResult);
      expect(service.closeShift).toHaveBeenCalledWith(id, closeShiftDto, userId);
    });
  });

  describe('getShiftSummary', () => {
    it('should get shift summary', async () => {
      const id = 1;
      const expectedResult = {
        shift: { id, status: 'closed' },
        invoices: [],
        transactions: [],
        summary: {
          totalSales: 0,
          totalReceived: 0,
          totalPaid: 0,
          calculatedBalance: 0,
          declaredEndAmount: 0,
          difference: 0,
        },
      };

      jest.spyOn(service, 'getShiftSummary').mockResolvedValue(expectedResult as any);

      const result = await controller.getShiftSummary(id);

      expect(result).toEqual(expectedResult);
      expect(service.getShiftSummary).toHaveBeenCalledWith(id);
    });
  });
});
