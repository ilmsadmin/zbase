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
} from '@nestjs/common';
import { PriceListsService } from './price-lists.service';
import { 
  CreatePriceListDto, 
  UpdatePriceListDto,
  AddPriceListItemDto,
  UpdatePriceListItemDto
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('price-lists')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PriceListsController {
  constructor(private readonly priceListsService: PriceListsService) {}

  @Post()
  @RequirePermissions('price-lists.create')
  create(@Body() createPriceListDto: CreatePriceListDto) {
    return this.priceListsService.create(createPriceListDto);
  }

  @Get()
  @RequirePermissions('price-lists.read')
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('customerGroupId', new ParseIntPipe({ optional: true })) customerGroupId?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.priceListsService.findAll(search, status, customerGroupId, page, limit);
  }

  @Get(':id')
  @RequirePermissions('price-lists.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.priceListsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('price-lists.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePriceListDto: UpdatePriceListDto,
  ) {
    return this.priceListsService.update(id, updatePriceListDto);
  }

  @Delete(':id')
  @RequirePermissions('price-lists.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.priceListsService.remove(id);
  }

  @Post(':id/items')
  @RequirePermissions('price-lists.update')
  addPriceListItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPriceListItemDto: AddPriceListItemDto,
  ) {
    return this.priceListsService.addPriceListItem(id, addPriceListItemDto);
  }

  @Get(':id/items')
  @RequirePermissions('price-lists.read')
  findAllItems(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.priceListsService.findAllItems(id, page, limit);
  }

  @Patch(':id/items/:itemId')
  @RequirePermissions('price-lists.update')
  updatePriceListItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updatePriceListItemDto: UpdatePriceListItemDto,
  ) {
    return this.priceListsService.updatePriceListItem(id, itemId, updatePriceListItemDto);
  }

  @Delete(':id/items/:itemId')
  @RequirePermissions('price-lists.delete')
  removePriceListItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.priceListsService.removePriceListItem(id, itemId);
  }

  @Post(':id/set-default')
  @RequirePermissions('price-lists.update')
  setAsDefault(@Param('id', ParseIntPipe) id: number) {
    return this.priceListsService.setAsDefault(id);
  }

  @Get('/for-customer/:customerId')
  @RequirePermissions('price-lists.read')
  getPriceListForCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.priceListsService.getPriceListForCustomer(customerId);
  }
}
