import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { WarehouseLocationsService } from './warehouse-locations.service';
import { CreateWarehouseLocationDto, UpdateWarehouseLocationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('warehouse-locations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WarehouseLocationsController {
  constructor(private readonly warehouseLocationsService: WarehouseLocationsService) {}

  @Post()
  @RequirePermissions('warehouse-locations.create')
  create(@Body() createWarehouseLocationDto: CreateWarehouseLocationDto) {
    return this.warehouseLocationsService.create(createWarehouseLocationDto);
  }

  @Get()
  @RequirePermissions('warehouse-locations.read')
  findAll(@Query('warehouseId') warehouseId?: string) {
    return this.warehouseLocationsService.findAll(
      warehouseId ? parseInt(warehouseId, 10) : undefined
    );
  }

  @Get(':id')
  @RequirePermissions('warehouse-locations.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseLocationsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('warehouse-locations.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseLocationDto: UpdateWarehouseLocationDto,
  ) {
    return this.warehouseLocationsService.update(id, updateWarehouseLocationDto);
  }

  @Delete(':id')
  @RequirePermissions('warehouse-locations.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseLocationsService.remove(id);
  }
}
