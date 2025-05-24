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
  Req,
} from '@nestjs/common';
import { InvoiceTemplatesService } from './invoice-templates.service';
import { CreateInvoiceTemplateDto, UpdateInvoiceTemplateDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('invoices/templates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InvoiceTemplatesController {
  constructor(private readonly invoiceTemplatesService: InvoiceTemplatesService) {}

  @Post()
  @RequirePermissions('invoices.templates.create')
  create(@Body() createInvoiceTemplateDto: CreateInvoiceTemplateDto, @Req() req) {
    return this.invoiceTemplatesService.create(createInvoiceTemplateDto, req.user.id);
  }

  @Get()
  @RequirePermissions('invoices.templates.read')
  findAll(@Query('type') type?: string) {
    return this.invoiceTemplatesService.findAll(type);
  }

  @Get('default')
  @RequirePermissions('invoices.templates.read')
  findDefault(@Query('type') type?: string) {
    return this.invoiceTemplatesService.findDefault(type);
  }

  @Get(':id')
  @RequirePermissions('invoices.templates.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceTemplatesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('invoices.templates.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInvoiceTemplateDto: UpdateInvoiceTemplateDto,
  ) {
    return this.invoiceTemplatesService.update(id, updateInvoiceTemplateDto);
  }

  @Delete(':id')
  @RequirePermissions('invoices.templates.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceTemplatesService.remove(id);
  }

  @Post(':id/set-default')
  @RequirePermissions('invoices.templates.update')
  setAsDefault(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceTemplatesService.setAsDefault(id);
  }
}
