import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from './partners.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto, UpdatePartnerDto } from './dto';

describe('PartnersService', () => {
  let service: PartnersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        {
          provide: PrismaService,
          useValue: {
            partner: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            transaction: {
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PartnersService>(PartnersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a partner successfully', async () => {
      const createPartnerDto: CreatePartnerDto = {
        name: 'Test Partner',
        code: 'TP001',
        contactPerson: 'John Doe',
      };

      const mockPartner = {
        id: 1,
        ...createPartnerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(null);
      (prismaService.partner.create as jest.Mock).mockResolvedValueOnce(mockPartner);

      const result = await service.create(createPartnerDto);
      
      expect(prismaService.partner.findUnique).toHaveBeenCalledWith({
        where: { code: 'TP001' },
      });
      expect(prismaService.partner.create).toHaveBeenCalledWith({
        data: createPartnerDto,
      });
      expect(result).toBe(mockPartner);
    });

    it('should throw BadRequestException if partner with same code exists', async () => {
      const createPartnerDto: CreatePartnerDto = {
        name: 'Test Partner',
        code: 'TP001',
      };

      const existingPartner = {
        id: 1,
        name: 'Existing Partner',
        code: 'TP001',
      };

      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(existingPartner);

      await expect(service.create(createPartnerDto)).rejects.toThrow(BadRequestException);
      expect(prismaService.partner.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated partners', async () => {
      const mockPartners = [
        { id: 1, name: 'Partner 1' },
        { id: 2, name: 'Partner 2' },
      ];

      (prismaService.partner.findMany as jest.Mock).mockResolvedValueOnce(mockPartners);
      (prismaService.partner.count as jest.Mock).mockResolvedValueOnce(2);

      const result = await service.findAll('test', 1, 10);

      expect(prismaService.partner.findMany).toHaveBeenCalled();
      expect(prismaService.partner.count).toHaveBeenCalled();
      expect(result).toEqual({
        items: mockPartners,
        meta: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a partner by id', async () => {
      const mockPartner = { id: 1, name: 'Partner 1' };
      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(mockPartner);

      const result = await service.findOne(1);

      expect(prismaService.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mockPartner);
    });

    it('should throw NotFoundException if partner not found', async () => {
      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a partner successfully', async () => {
      const existingPartner = {
        id: 1,
        name: 'Old Name',
        code: 'TP001',
      };

      const updatePartnerDto: UpdatePartnerDto = {
        name: 'New Name',
      };

      const updatedPartner = {
        ...existingPartner,
        ...updatePartnerDto,
      };

      (prismaService.partner.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingPartner); // For checking if partner exists
      
      (prismaService.partner.update as jest.Mock).mockResolvedValueOnce(updatedPartner);

      const result = await service.update(1, updatePartnerDto);

      expect(prismaService.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.partner.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePartnerDto,
      });
      expect(result).toBe(updatedPartner);
    });
  });

  describe('remove', () => {
    it('should delete a partner successfully', async () => {
      const mockPartner = { id: 1, name: 'Partner to delete' };
      
      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(mockPartner);
      (prismaService.transaction.count as jest.Mock).mockResolvedValueOnce(0);
      (prismaService.partner.delete as jest.Mock).mockResolvedValueOnce(mockPartner);

      const result = await service.remove(1);

      expect(prismaService.partner.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaService.transaction.count).toHaveBeenCalledWith({
        where: { partnerId: 1 },
      });
      expect(prismaService.partner.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toBe(mockPartner);
    });

    it('should throw BadRequestException if partner has transactions', async () => {
      const mockPartner = { id: 1, name: 'Partner with transactions' };
      
      (prismaService.partner.findUnique as jest.Mock).mockResolvedValueOnce(mockPartner);
      (prismaService.transaction.count as jest.Mock).mockResolvedValueOnce(5);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      expect(prismaService.partner.delete).not.toHaveBeenCalled();
    });
  });
});
