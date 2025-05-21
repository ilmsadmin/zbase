import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CreatePartnerDto } from './dto';

describe('PartnersController', () => {
  let controller: PartnersController;
  let service: PartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PrismaModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        ConfigModule.forRoot(),
      ],
      controllers: [PartnersController],
      providers: [PartnersService],
    }).compile();

    controller = module.get<PartnersController>(PartnersController);
    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with createPartnerDto', async () => {
      const createPartnerDto: CreatePartnerDto = {
        name: 'Test Partner',
        contactPerson: 'John Doe',
        phone: '123456789',
        email: 'test@example.com',
      };
      
      jest.spyOn(service, 'create').mockImplementation(async () => {
        return { id: 1, ...createPartnerDto, createdAt: new Date(), updatedAt: new Date() } as any;
      });
      
      await controller.create(createPartnerDto);
      expect(service.create).toHaveBeenCalledWith(createPartnerDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with correct parameters', async () => {
      const mockResult = {
        items: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 }
      };
      
      jest.spyOn(service, 'findAll').mockImplementation(async () => mockResult);
      
      await controller.findAll('test', 1, 20);
      expect(service.findAll).toHaveBeenCalledWith('test', 1, 20);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const partnerId = 1;
      jest.spyOn(service, 'findOne').mockImplementation(async () => ({ id: partnerId } as any));
      
      await controller.findOne(partnerId);
      expect(service.findOne).toHaveBeenCalledWith(partnerId);
    });
  });

  describe('update', () => {
    it('should call service.update with correct id and dto', async () => {
      const partnerId = 1;
      const updateDto = { name: 'Updated Name' };
      
      jest.spyOn(service, 'update').mockImplementation(async () => ({ id: partnerId, ...updateDto } as any));
      
      await controller.update(partnerId, updateDto);
      expect(service.update).toHaveBeenCalledWith(partnerId, updateDto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const partnerId = 1;
      jest.spyOn(service, 'remove').mockImplementation(async () => ({ id: partnerId } as any));
      
      await controller.remove(partnerId);
      expect(service.remove).toHaveBeenCalledWith(partnerId);
    });
  });
});
