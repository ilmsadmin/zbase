import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { 
  CreateQuickSaleDto, 
  InventoryCheckDto
} from './dto';

@Controller('pos')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('check-shift')
  @RequirePermissions('pos.read')
  checkActiveShift(@GetUser('id') userId: number) {
    return this.posService.checkActiveShift(userId);
  }

  @Post('quick-sale')
  @RequirePermissions('pos.create')
  createQuickSale(
    @Body() createQuickSaleDto: CreateQuickSaleDto,
    @GetUser('id') userId: number,
  ) {
    return this.posService.createQuickSale(createQuickSaleDto, userId);
  }

  @Post('check-inventory')
  @RequirePermissions('pos.read')
  checkInventory(
    @Body() inventoryCheckDto: InventoryCheckDto,
    @GetUser('id') userId: number,
  ) {
    return this.posService.checkInventory(inventoryCheckDto, userId);
  }

  @Get('dashboard')
  @RequirePermissions('pos.read')
  getDashboardData(@GetUser('id') userId: number) {
    return this.posService.getDashboardData(userId);
  }

  @Get('recent-sales')
  @RequirePermissions('pos.read')
  getRecentSales(
    @GetUser('id') userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    return this.posService.getRecentSales(userId, page, limit);
  }

  @Get('product-search')
  @RequirePermissions('pos.read')
  searchProducts(
    @Query('query') query: string,
    @Query('warehouseId', ParseIntPipe) warehouseId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.posService.searchProducts(query, warehouseId, page, limit);
  }

  @Get('customer-search')
  @RequirePermissions('pos.read')
  searchCustomers(
    @Query('query') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.posService.searchCustomers(query, page, limit);
  }
}
