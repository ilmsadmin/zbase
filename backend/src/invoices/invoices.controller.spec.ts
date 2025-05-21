import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { CreateInvoiceDto, CancelInvoiceDto } from './dto';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        InventoryModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        ConfigModule.forRoot(),
      ],
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByCode: jest.fn(),
            update: jest.fn(),
            cancelInvoice: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with createInvoiceDto', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        userId: 1,
        warehouseId: 1,
        items: [
          {
            productId: 1,
            quantity: 2,
            unitPrice: 100,
          },
        ],
      };
      
      jest.spyOn(service, 'create').mockResolvedValueOnce({
        id: 1,
        code: 'INV20250501001',
        ...createInvoiceDto,
      } as any);
      
      await controller.create(createInvoiceDto);
      expect(service.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const mockResult = {
        items: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 }
      };
      
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockResult);
      
      await controller.findAll('1', '2', '3', 'pending', '2025-05-01', '2025-05-31', 'search', 1, 20);
      
      expect(service.findAll).toHaveBeenCalledWith(
        1, 2, 3, 'pending', 
        expect.any(Date), expect.any(Date), 
        'search', 1, 20
      );
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const invoiceId = 1;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({ id: invoiceId } as any);
      
      await controller.findOne(invoiceId);
      expect(service.findOne).toHaveBeenCalledWith(invoiceId);
    });
  });

  describe('findByCode', () => {
    it('should call service.findByCode with correct code', async () => {
      const invoiceCode = 'INV20250501001';
      jest.spyOn(service, 'findByCode').mockResolvedValueOnce({ code: invoiceCode } as any);
      
      await controller.findByCode(invoiceCode);
      expect(service.findByCode).toHaveBeenCalledWith(invoiceCode);
    });
  });

  describe('update', () => {
    it('should call service.update with correct id and dto', async () => {
      const invoiceId = 1;
      const updateDto = { notes: 'Updated Notes' };
      
      jest.spyOn(service, 'update').mockResolvedValueOnce({ id: invoiceId, ...updateDto } as any);
      
      await controller.update(invoiceId, updateDto);
      expect(service.update).toHaveBeenCalledWith(invoiceId, updateDto);
    });
  });

  describe('cancelInvoice', () => {
    it('should call service.cancelInvoice with correct id and reason', async () => {
      const invoiceId = 1;
      const cancelDto: CancelInvoiceDto = { reason: 'Customer canceled order' };
      
      jest.spyOn(service, 'cancelInvoice').mockResolvedValueOnce({ id: invoiceId, status: 'canceled' } as any);
      
      await controller.cancelInvoice(invoiceId, cancelDto);
      expect(service.cancelInvoice).toHaveBeenCalledWith(invoiceId, cancelDto.reason);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const invoiceId = 1;
      jest.spyOn(service, 'remove').mockImplementation();
      
      try {
        await controller.remove(invoiceId);
      } catch (error) {
        // Should throw error as invoices should not be deleted
      }
      
      expect(service.remove).toHaveBeenCalledWith(invoiceId);
    });
  });
});
