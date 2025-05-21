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
} from '@nestjs/common';
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributeDto, UpdateProductAttributeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('product-attributes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductAttributesController {
  constructor(private readonly productAttributesService: ProductAttributesService) {}

  @Post()
  @RequirePermissions('product-attributes.create')
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributesService.create(createProductAttributeDto);
  }

  @Post('bulk')
  @RequirePermissions('product-attributes.create')
  bulkCreate(@Body() attributes: CreateProductAttributeDto[]) {
    return this.productAttributesService.bulkCreate(attributes);
  }
  @Get()
  @RequirePermissions('product-attributes.read')
  findAll(@Query('productId') productId?: string) {
    return this.productAttributesService.findAll(
      productId ? parseInt(productId, 10) : undefined
    );
  }
    @Get('summary')
  @RequirePermissions('product-attributes.read')
  async getAttributeSummary() {
    return this.productAttributesService.getAttributeSummary();
  }
  
  @Get('common-attributes')
  @RequirePermissions('product-attributes.read')
  async getCommonAttributes() {
    return this.productAttributesService.getCommonAttributes();
  }

  @Get(':id')
  @RequirePermissions('product-attributes.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('product-attributes.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductAttributeDto: UpdateProductAttributeDto,
  ) {
    return this.productAttributesService.update(id, updateProductAttributeDto);
  }

  @Delete(':id')
  @RequirePermissions('product-attributes.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productAttributesService.remove(id);
  }

  @Delete('product/:productId')
  @RequirePermissions('product-attributes.delete')
  removeAllForProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productAttributesService.removeAllForProduct(productId);
  }
}
