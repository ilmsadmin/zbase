import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseDto, UpdateWarehouseDto } from './dto';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseDto: CreateWarehouseDto) {
    return this.prisma.warehouse.create({
      data: createWarehouseDto,
    });
  }

  async findAll() {
    return this.prisma.warehouse.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            locations: true,
            inventory: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        locations: true,
        _count: {
          select: {
            inventory: true,
            inventoryTransactions: true,
          },
        },
      },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    // Check if the warehouse exists
    await this.findOne(id);

    return this.prisma.warehouse.update({
      where: { id },
      data: updateWarehouseDto,
    });
  }

  async remove(id: number) {
    // Check if the warehouse exists
    await this.findOne(id);
    
    return this.prisma.warehouse.delete({
      where: { id },
    });
  }
}
