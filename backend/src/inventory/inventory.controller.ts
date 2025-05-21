import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto, CreateInventoryTransactionDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @RequirePermissions('inventory.create')
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @RequirePermissions('inventory.read')
  findAll(
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
    @Query('locationId') locationId?: string,
    @Query('lowStock', ParseBoolPipe, new DefaultValuePipe(false)) lowStock?: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.inventoryService.findAll(
      warehouseId ? parseInt(warehouseId, 10) : undefined,
      productId ? parseInt(productId, 10) : undefined,
      locationId ? parseInt(locationId, 10) : undefined,
      lowStock,
      page,
      limit
    );
  }

  @Get(':id')
  @RequirePermissions('inventory.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('inventory.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @RequirePermissions('inventory.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }

  // Inventory Transactions endpoints
  @Post('transactions')
  @RequirePermissions('inventory.transactions.create')
  createTransaction(@Body() createInventoryTransactionDto: CreateInventoryTransactionDto) {
    return this.inventoryService.createTransaction(createInventoryTransactionDto);
  }

  @Get('transactions')
  @RequirePermissions('inventory.transactions.read')
  getTransactions(
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('locationId') locationId?: string,
    @Query('transactionType') transactionType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.inventoryService.getTransactions(
      productId ? parseInt(productId, 10) : undefined,
      warehouseId ? parseInt(warehouseId, 10) : undefined,
      locationId ? parseInt(locationId, 10) : undefined,
      transactionType,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      page,
      limit
    );
  }

  @Get('transactions/:id')
  @RequirePermissions('inventory.transactions.read')
  getTransactionById(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getTransactionById(id);
  }
}
