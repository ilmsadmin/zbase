import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseLocationDto, UpdateWarehouseLocationDto } from './dto';

@Injectable()
export class WarehouseLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarehouseLocationDto: CreateWarehouseLocationDto) {
    // Verify that the warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createWarehouseLocationDto.warehouseId },
    });
    
    if (!warehouse) {
      throw new BadRequestException(`Warehouse with ID ${createWarehouseLocationDto.warehouseId} not found`);
    }

    // Check if location with same coordinates already exists
    const existingLocation = await this.prisma.warehouseLocation.findFirst({
      where: {
        warehouseId: createWarehouseLocationDto.warehouseId,
        zone: createWarehouseLocationDto.zone,
        aisle: createWarehouseLocationDto.aisle,
        rack: createWarehouseLocationDto.rack,
        shelf: createWarehouseLocationDto.shelf,
        position: createWarehouseLocationDto.position,
      },
    });

    if (existingLocation) {
      throw new BadRequestException('Location with these coordinates already exists in the warehouse');
    }

    return this.prisma.warehouseLocation.create({
      data: createWarehouseLocationDto,
    });
  }  async findAll(warehouseId?: number) {
    const queryOptions = {
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    };
    
    if (warehouseId) {
      return this.prisma.warehouseLocation.findMany({
        ...queryOptions,
        where: { warehouseId },
      });
    }
    
    return this.prisma.warehouseLocation.findMany(queryOptions);
  }

  async findOne(id: number) {
    const location = await this.prisma.warehouseLocation.findUnique({
      where: { id },
      include: {
        warehouse: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        inventory: {
          include: {            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!location) {
      throw new NotFoundException(`Warehouse location with ID ${id} not found`);
    }

    return location;
  }

  async update(id: number, updateWarehouseLocationDto: UpdateWarehouseLocationDto) {
    // Check if location exists
    await this.findOne(id);
    
    // If changing coordinates, check if they don't conflict
    if (
      updateWarehouseLocationDto.warehouseId ||
      updateWarehouseLocationDto.zone ||
      updateWarehouseLocationDto.aisle ||
      updateWarehouseLocationDto.rack ||
      updateWarehouseLocationDto.shelf ||
      updateWarehouseLocationDto.position
    ) {
      const location = await this.prisma.warehouseLocation.findUnique({
        where: { id },
      });
      
      if (!location) {
        throw new NotFoundException(`Warehouse location with ID ${id} not found`);
      }
      
      const existingLocation = await this.prisma.warehouseLocation.findFirst({
        where: {
          id: { not: id },
          warehouseId: updateWarehouseLocationDto.warehouseId || location.warehouseId,
          zone: updateWarehouseLocationDto.zone || location.zone,
          aisle: updateWarehouseLocationDto.aisle || location.aisle,
          rack: updateWarehouseLocationDto.rack || location.rack,
          shelf: updateWarehouseLocationDto.shelf || location.shelf,
          position: updateWarehouseLocationDto.position || location.position,
        },
      });

      if (existingLocation) {
        throw new BadRequestException('Location with these coordinates already exists in the warehouse');
      }
    }

    return this.prisma.warehouseLocation.update({
      where: { id },
      data: updateWarehouseLocationDto,
    });
  }

  async remove(id: number) {
    // Check if location exists
    await this.findOne(id);
    
    // Check if location has inventory
    const locationWithInventory = await this.prisma.warehouseLocation.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            inventory: true,
          },
        },
      },
    });    if (locationWithInventory && locationWithInventory._count.inventory > 0) {
      throw new BadRequestException('Cannot delete location with inventory items');
    }
    
    return this.prisma.warehouseLocation.delete({
      where: { id },
    });
  }
}
