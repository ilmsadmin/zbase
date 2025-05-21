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
  ParseIntPipe 
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto, UpdateProductCategoryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequirePermissions } from '../permissions/permissions.decorator';

@Controller('product-categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Post()
  @RequirePermissions('product-categories.create')
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoriesService.create(createProductCategoryDto);
  }

  @Get()
  @RequirePermissions('product-categories.read')
  findAll(@Query('parentId') parentId?: string) {
    return this.productCategoriesService.findAll(
      parentId ? parseInt(parentId, 10) : undefined
    );
  }

  @Get(':id')
  @RequirePermissions('product-categories.read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('product-categories.update')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoriesService.update(id, updateProductCategoryDto);
  }

  @Delete(':id')
  @RequirePermissions('product-categories.delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productCategoriesService.remove(id);
  }
}
