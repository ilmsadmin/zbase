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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto, CancelInvoiceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('invoices')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @RequirePermissions('invoices.create')
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @RequirePermissions('invoices.read')
  findAll(
    @Query('customerId') customerId?: string,
    @Query('userId') userId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.invoicesService.findAll(
      customerId ? parseInt(customerId, 10) : undefined,
      userId ? parseInt(userId, 10) : undefined,
      warehouseId ? parseInt(warehouseId, 10) : undefined,
      status,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      search,
      page,
      limit,
    );
  }

  @Get(':id')
  @RequirePermissions('invoices.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOne(id);
  }

  @Get('code/:code')
  @RequirePermissions('invoices.read')
  findByCode(@Param('code') code: string) {
    return this.invoicesService.findByCode(code);
  }

  @Patch(':id')
  @RequirePermissions('invoices.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Patch(':id/cancel')
  @RequirePermissions('invoices.cancel')
  cancelInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelInvoiceDto: CancelInvoiceDto,
  ) {
    return this.invoicesService.cancelInvoice(id, cancelInvoiceDto.reason);
  }

  @Delete(':id')
  @RequirePermissions('invoices.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.remove(id);
  }
}
