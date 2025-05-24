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
  Res,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto, CancelInvoiceDto, CreatePaymentDto, SendEmailDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';
import { Response } from 'express';

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

  @Post(':id/payments')
  @RequirePermissions('invoices.payments.create')
  addPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.invoicesService.addPayment(id, createPaymentDto);
  }

  @Get(':id/payments')
  @RequirePermissions('invoices.payments.read')
  getInvoicePayments(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.getInvoicePayments(id);
  }
  @Get(':id/pdf')
  @RequirePermissions('invoices.generate.pdf')
  async generatePdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoicesService.generatePdf(id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Get(':id/pdf-with-template/:templateId')
  @RequirePermissions('invoices.generate.pdf')
  async generatePdfWithTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Param('templateId', ParseIntPipe) templateId: number,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoicesService.generatePdf(id, templateId);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${id}-template-${templateId}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  }

  @Post(':id/send-email')
  @RequirePermissions('invoices.send.email')
  sendInvoiceByEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() sendEmailDto: SendEmailDto,
  ) {
    return this.invoicesService.sendInvoiceByEmail(id, sendEmailDto);
  }

  @Get('statistics')
  @RequirePermissions('invoices.statistics.read')
  getInvoiceStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.invoicesService.getInvoiceStatistics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }
  @Post(':id/mark-as-paid')
  @RequirePermissions('invoices.update')
  markAsPaid(
    @Param('id', ParseIntPipe) id: number,
    @Body() paymentData: CreatePaymentDto,
  ) {
    return this.invoicesService.markAsPaid(id, paymentData);
  }
}
