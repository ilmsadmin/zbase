import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnerDto, UpdatePartnerDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPartnerDto: CreatePartnerDto) {
    // Check if partner with same code already exists (if code provided)
    if (createPartnerDto.code) {
      const existingPartner = await this.prisma.partner.findUnique({
        where: { code: createPartnerDto.code },
      });

      if (existingPartner) {
        throw new BadRequestException(`Partner with code ${createPartnerDto.code} already exists`);
      }
    }

    return this.prisma.partner.create({
      data: createPartnerDto,
    });
  }

  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: Prisma.PartnerWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.partner.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    return partner;
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    // Check if partner exists
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Check if code is being updated and if the new code already exists
    if (updatePartnerDto.code && updatePartnerDto.code !== partner.code) {
      const existingPartner = await this.prisma.partner.findUnique({
        where: { code: updatePartnerDto.code },
      });

      if (existingPartner && existingPartner.id !== id) {
        throw new BadRequestException(`Partner with code ${updatePartnerDto.code} already exists`);
      }
    }

    return this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
  }

  async remove(id: number) {
    // Check if partner exists
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Check if partner has associated transactions
    const transactionCount = await this.prisma.transaction.count({
      where: { partnerId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestException(`Cannot delete partner with ${transactionCount} associated transactions`);
    }

    return this.prisma.partner.delete({
      where: { id },
    });
  }
}
