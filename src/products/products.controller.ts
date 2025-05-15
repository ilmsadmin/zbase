import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Logger
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createProductDto: CreateProductDto) {
    this.logger.log(`Creating a new product: ${createProductDto.name}`);
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiResponse({ status: 200, description: 'List of products.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'siteId', required: false, type: Number, description: 'Filter by site ID' })
  @ApiQuery({ name: 'featured', required: false, type: Boolean, description: 'Filter by featured status' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('siteId') siteId?: number,
    @Query('featured') featured?: boolean,
  ) {
    this.logger.log('Getting all products');
    return this.productsService.findAllWithPagination(
      page, 
      limit, 
      search, 
      sortBy, 
      siteId,
      featured === undefined ? undefined : featured === true,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    this.logger.log(`Getting product with ID: ${id}`);
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    this.logger.log(`Updating product with ID: ${id}`);
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id') id: string) {
    this.logger.log(`Deleting product with ID: ${id}`);
    return this.productsService.remove(+id);
  }

  @Post('sync/:siteId')
  @ApiOperation({ summary: 'Sync products from WooCommerce for a specific site' })
  @ApiResponse({ status: 200, description: 'Products synced successfully.' })
  @ApiResponse({ status: 404, description: 'Site not found.' })
  @ApiResponse({ status: 400, description: 'Bad request or WooCommerce not enabled for site.' })
  syncFromWooCommerce(@Param('siteId') siteId: string) {
    this.logger.log(`Syncing products from WooCommerce for site ID: ${siteId}`);
    return this.productsService.syncFromWooCommerce(+siteId);
  }
}
