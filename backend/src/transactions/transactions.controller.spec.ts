import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionType, TransactionMethod } from './dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByCode: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {    it('should create a transaction', async () => {
      const dto: CreateTransactionDto = {
        transactionType: TransactionType.RECEIPT,
        transactionMethod: TransactionMethod.CASH,
        amount: 100,
        userId: 1,
      };
      
      const expectedResult = { id: 1, ...dto };
      mockTransactionsService.create.mockResolvedValue(expectedResult);
      
      expect(await controller.create(dto)).toBe(expectedResult);
      expect(mockTransactionsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transactions = [{ id: 1 }, { id: 2 }];
      mockTransactionsService.findAll.mockResolvedValue(transactions);
      
      expect(await controller.findAll({})).toBe(transactions);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const transaction = { id: 1 };
      mockTransactionsService.findOne.mockResolvedValue(transaction);
      
      expect(await controller.findOne(1)).toBe(transaction);
      expect(mockTransactionsService.findOne).toHaveBeenCalledWith(1);
    });
  });
});
