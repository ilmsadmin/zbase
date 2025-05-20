import { Controller, Get, Post, Body, Param, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @RequirePermissions('read:inventory')
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('warehouse/:warehouseId')
  @RequirePermissions('read:inventory')
  findByWarehouse(@Param('warehouseId', ParseIntPipe) warehouseId: number) {
    return this.inventoryService.findByWarehouse(warehouseId);
  }

  @Get('product/:productId')
  @RequirePermissions('read:inventory')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.inventoryService.findByProduct(productId);
  }

  @Post('import')
  @RequirePermissions('import:inventory')
  importProducts(@Body() updateInventoryDto: UpdateInventoryDto, @Request() req) {
    return this.inventoryService.importProducts(updateInventoryDto, req.user.userId);
  }

  @Post('export')
  @RequirePermissions('export:inventory')
  exportProducts(@Body() updateInventoryDto: UpdateInventoryDto, @Request() req) {
    return this.inventoryService.exportProducts(updateInventoryDto, req.user.userId);
  }

  @Get('transactions')
  @RequirePermissions('read:inventory')
  getTransactions(
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
  ) {
    return this.inventoryService.getInventoryTransactions(
      warehouseId ? parseInt(warehouseId) : undefined,
      productId ? parseInt(productId) : undefined,
    );
  }

  @Get('low-stock')
  @RequirePermissions('read:inventory')
  checkLowStock(@Query('threshold') threshold?: string) {
    return this.inventoryService.checkLowStock(threshold ? parseInt(threshold) : 5);
  }
}
