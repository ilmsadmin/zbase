import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Site } from '../entities/site.entity';
import { ProductSyncHelper } from './helpers/product-sync.helper';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['site'],
    });
  }

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortBy: string = 'id',
    siteId?: number,
    featured?: boolean,
  ): Promise<{ products: Product[]; totalItems: number; totalPages: number }> {
    this.logger.log(`Finding products with pagination: page=${page}, limit=${limit}, search=${search}, sortBy=${sortBy}, siteId=${siteId}`);
    
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.site', 'site');
    
    // Apply search filter
    if (search) {
      queryBuilder.andWhere('(product.name LIKE :search OR product.description LIKE :search)', 
        { search: `%${search}%` });
    }
    
    // Filter by site if specified
    if (siteId) {
      queryBuilder.andWhere('site.id = :siteId', { siteId });
    }
    
    // Filter by featured status if specified
    if (featured !== undefined) {
      queryBuilder.andWhere('product.featured = :featured', { featured });
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'price_asc':
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case 'price_desc':
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case 'name_asc':
        queryBuilder.orderBy('product.name', 'ASC');
        break;
      case 'name_desc':
        queryBuilder.orderBy('product.name', 'DESC');
        break;
      case 'newest':
        queryBuilder.orderBy('product.created_at', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.id', 'ASC');
    }
    
    // Get total count for pagination
    const totalItems = await queryBuilder.getCount();
    
    // Apply pagination
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);
    
    const products = await queryBuilder.getMany();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      products,
      totalItems,
      totalPages
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['site'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product | any> {
    this.logger.log('Creating a new product');

    // Validate site if siteId is provided
    if (!createProductDto.siteId) {
      throw new BadRequestException('Site ID is required for creating a product');
    }
    
    const site = await this.siteRepository.findOne({
      where: { id: createProductDto.siteId },
    });

    if (!site) {
      throw new NotFoundException(`Site with ID ${createProductDto.siteId} not found`);
    }

    // Check if site has WooCommerce enabled
    if (!site.has_woocommerce) {
      throw new BadRequestException(`Site with ID ${createProductDto.siteId} does not have WooCommerce enabled`);
    }
    
    // Make sure the site has valid WooCommerce credentials
    if (!site.wc_key || !site.wc_secret || !site.wp_url) {
      throw new BadRequestException(`Site with ID ${createProductDto.siteId} has incomplete WooCommerce credentials`);
    }
    
    // Khởi tạo các biến theo dõi trạng thái WooCommerce
    let wcProductId: number | null = null;
    let wcSyncStatus = 'pending';
    let wcErrorMessage: string | null = null;
    
    // Chuẩn bị đối tượng sản phẩm để lưu vào database
    const newProduct = new Product();
    newProduct.name = createProductDto.name;
    newProduct.price = createProductDto.price;
    newProduct.site = site;
    
    // Thiết lập các trường tùy chọn
    if (createProductDto.description) newProduct.description = createProductDto.description;
    if (createProductDto.short_description) newProduct.short_description = createProductDto.short_description;
    if (createProductDto.regular_price) newProduct.regular_price = createProductDto.regular_price;
    if (createProductDto.sale_price) newProduct.sale_price = createProductDto.sale_price;
    if (createProductDto.stock !== undefined) newProduct.stock = createProductDto.stock;
    if (createProductDto.stock_status) newProduct.stock_status = createProductDto.stock_status;
    if (createProductDto.type) newProduct.type = createProductDto.type;
    if (createProductDto.featured !== undefined) newProduct.featured = createProductDto.featured;
    
    // Thiết lập các trường array
    if (createProductDto.images) newProduct.images = createProductDto.images;
    if (createProductDto.categories) newProduct.categories = createProductDto.categories;
    if (createProductDto.attributes) newProduct.attributes = createProductDto.attributes;
    
    try {
      // Thử tạo sản phẩm trên WooCommerce trước
      try {
        const wcProduct = await ProductSyncHelper.createProduct(site, createProductDto);
        if (wcProduct && wcProduct.id) {
          wcProductId = wcProduct.id;
          wcSyncStatus = 'synced';
          this.logger.log(`Product created on WooCommerce with ID: ${wcProductId}`);
        }
      } catch (error: any) {
        // Ghi lại lỗi từ WooCommerce nhưng không dừng lại
        wcErrorMessage = error.message || 'Unknown WooCommerce error';
        this.logger.error(`WooCommerce API error: ${wcErrorMessage}`);
      }
      
      // Thiết lập trạng thái đồng bộ với WooCommerce
      if (wcProductId !== null) {
        newProduct.wc_product_id = wcProductId;
      }
      newProduct.wc_sync_status = wcSyncStatus;
      if (wcErrorMessage !== null) {
        newProduct.wc_error = wcErrorMessage;
      }
      newProduct.wc_last_sync_attempt = new Date();
      
      // Lưu sản phẩm vào database
      const savedProduct = await this.productRepository.save(newProduct);
      
      // Trả về thông tin sản phẩm đã lưu với thông tin bổ sung nếu có lỗi WooCommerce
      return {
        ...savedProduct,
        wc_sync_status: savedProduct.wc_sync_status,
        wc_error: savedProduct.wc_error,
      };
    } catch (dbError: any) {
      this.logger.error(`Error creating product in database: ${dbError.message}`);
      throw new BadRequestException(`Failed to create product: ${dbError.message}`);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`Updating product with id: ${id}`);
    
    const product = await this.findOne(id);
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Handle site change if needed
    if (updateProductDto.siteId && updateProductDto.siteId !== product.site.id) {
      const newSite = await this.siteRepository.findOne({
        where: { id: updateProductDto.siteId },
      });
      
      if (!newSite) {
        throw new NotFoundException(`Site with ID ${updateProductDto.siteId} not found`);
      }
      
      if (!newSite.has_woocommerce) {
        throw new BadRequestException(`Site with ID ${updateProductDto.siteId} does not have WooCommerce enabled`);
      }
      
      updateProductDto.site = newSite;
    } else {
      // Make sure we're using the full site object with all credentials
      const currentSite = await this.siteRepository.findOne({
        where: { id: product.site.id },
      });
      
      if (!currentSite) {
        throw new NotFoundException(`Current site with ID ${product.site.id} not found`);
      }
      
      updateProductDto.site = currentSite;
    }
    
    // Khởi tạo các biến theo dõi trạng thái WooCommerce
    let wcSyncStatus = product.wc_sync_status || 'pending';
    let wcErrorMessage: string | null = null;

    try {
      // Cập nhật WooCommerce nếu sản phẩm đã tồn tại trên đó
      if (product.wc_product_id) {
        try {
          await ProductSyncHelper.updateProduct(
            updateProductDto.site,
            product.wc_product_id,
            updateProductDto,
          );
          wcSyncStatus = 'synced';
        } catch (wcError: any) {
          // Ghi lại lỗi từ WooCommerce nhưng vẫn cập nhật database
          wcErrorMessage = wcError.message || 'Unknown WooCommerce error';
          wcSyncStatus = 'failed';
          this.logger.error(`WooCommerce API update error: ${wcErrorMessage}`);
        }
      }

      // Cập nhật trạng thái đồng bộ
      product.wc_sync_status = wcSyncStatus;
      if (wcErrorMessage !== null) {
        product.wc_error = wcErrorMessage;
      }
      product.wc_last_sync_attempt = new Date();
      
      // Cập nhật sản phẩm trong database
      this.productRepository.merge(product, updateProductDto);
      const updatedProduct = await this.productRepository.save(product);
      
      // Trả về thông tin sản phẩm đã cập nhật với thông tin bổ sung nếu có lỗi WooCommerce
      return updatedProduct;
    } catch (dbError: any) {
      this.logger.error(`Error updating product in database: ${dbError.message}`);
      throw new BadRequestException(`Failed to update product: ${dbError.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing product with id: ${id}`);
    
    const product = await this.findOne(id);
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    try {
      // Delete from WooCommerce if it exists there
      if (product.wc_product_id) {
        try {
          await ProductSyncHelper.deleteProduct(product.site, product.wc_product_id);
        } catch (wcError: any) {
          this.logger.error(`Error deleting product from WooCommerce: ${wcError.message}`);
          // Continue with database deletion even if WooCommerce delete fails
        }
      }
      
      await this.productRepository.remove(product);
    } catch (error: any) {
      this.logger.error(`Error removing product: ${error.message}`);
      throw new BadRequestException(`Failed to delete product: ${error.message}`);
    }
  }
  async syncFromWooCommerce(siteId: number): Promise<{ added: number; updated: number; failed: number }> {
    this.logger.log(`Syncing products from WooCommerce for site ID: ${siteId}`);
    
    const site = await this.siteRepository.findOne({
      where: { id: siteId },
    });
    
    if (!site) {
      throw new NotFoundException(`Site with ID ${siteId} not found`);
    }
    
    if (!site.has_woocommerce) {
      throw new BadRequestException(`Site with ID ${siteId} does not have WooCommerce enabled`);
    }
    
    try {
      let page = 1;
      const perPage = 20;
      let morePages = true;
      let addedCount = 0;
      let updatedCount = 0;
      let failedCount = 0;
      
      // Get existing products for this site
      const existingProducts = await this.productRepository.find({
        where: { site: { id: siteId } },
        relations: ['site']
      });
      
      // Create a map of existing WooCommerce product IDs to our product entities
      const existingWcProductMap = new Map();
      existingProducts.forEach(product => {
        if (product.wc_product_id) {
          existingWcProductMap.set(product.wc_product_id, product);
        }
      });
      
      this.logger.log(`Found ${existingProducts.length} existing products for site ID: ${siteId}`);
        // Fetch and process products page by page
      this.logger.log(`Starting to fetch products from WooCommerce for site: ${site.name} (${site.wp_url})`);
      
      try {
        // Validate WooCommerce credentials before proceeding
        if (!site.wc_key || !site.wc_secret) {
          this.logger.error(`Site ${site.name} (ID: ${site.id}) has missing WooCommerce credentials`);
          throw new BadRequestException(`Site with ID ${siteId} has incomplete WooCommerce credentials`);
        }
        
        this.logger.log(`WooCommerce credentials check passed for site ${site.name}`);
      } catch (e) {
        this.logger.error(`WooCommerce credentials validation error: ${e.message}`);
        throw e;
      }
      
      while (morePages) {
        try {
          this.logger.log(`Fetching products page ${page} (${perPage} products per page)`);
          
          const wcProducts = await ProductSyncHelper.fetchProductsFromWooCommerce(site, page, perPage);
          
          this.logger.log(`Received response from WooCommerce API with ${wcProducts ? wcProducts.length : 0} products`);
          
          if (!wcProducts || wcProducts.length === 0) {
            this.logger.log('No more products to process, ending synchronization');
            morePages = false;
            break;
          }
          
          this.logger.log(`Processing ${wcProducts.length} products from WooCommerce (page ${page})`);
            // Process each WooCommerce product
          for (const wcProduct of wcProducts) {
            try {
              // Validate product data
              if (!wcProduct || !wcProduct.id) {
                this.logger.warn('Received invalid product data from WooCommerce, skipping');
                continue;
              }
              
              this.logger.log(`Processing WooCommerce product: ${wcProduct.name} (WC ID: ${wcProduct.id})`);
              
              // Check if product already exists in our database
              const existingProduct = existingWcProductMap.get(wcProduct.id);
              
              if (existingProduct) {
                // Update existing product
                this.logger.log(`Updating existing product: ${wcProduct.name} (ID: ${existingProduct.id}, WC ID: ${wcProduct.id})`);
                
                existingProduct.name = wcProduct.name;
                existingProduct.description = wcProduct.description;
                existingProduct.short_description = wcProduct.short_description;
                existingProduct.price = parseFloat(wcProduct.price || wcProduct.regular_price || '0');
                existingProduct.regular_price = parseFloat(wcProduct.regular_price || '0');
                existingProduct.sale_price = wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : null;
                existingProduct.stock = wcProduct.stock_quantity || 0;
                existingProduct.stock_status = wcProduct.stock_status || 'instock';
                existingProduct.featured = wcProduct.featured || false;
                existingProduct.type = wcProduct.type || 'simple';
                
                // Handle images
                if (Array.isArray(wcProduct.images) && wcProduct.images.length > 0) {
                  existingProduct.images = wcProduct.images.map(img => ({
                    src: img.src,
                    name: img.name || '',
                    alt: img.alt || ''
                  }));
                }
                
                // Handle categories
                if (Array.isArray(wcProduct.categories) && wcProduct.categories.length > 0) {
                  existingProduct.categories = wcProduct.categories.map(cat => cat.name);
                }
                
                // Update sync status
                existingProduct.wc_sync_status = 'synced';
                existingProduct.wc_last_sync_attempt = new Date();
                existingProduct.wc_error = '';
                
                await this.productRepository.save(existingProduct);
                updatedCount++;
              } else {
                // Create new product
                this.logger.debug(`Creating new product from WooCommerce: ${wcProduct.name} (WC ID: ${wcProduct.id})`);
                
                const newProduct = new Product();
                newProduct.site = site;
                newProduct.name = wcProduct.name;
                newProduct.description = wcProduct.description;
                newProduct.short_description = wcProduct.short_description;
                newProduct.price = parseFloat(wcProduct.price || wcProduct.regular_price || '0');
                newProduct.regular_price = parseFloat(wcProduct.regular_price || '0');
                newProduct.sale_price = wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : 0;
                newProduct.stock = wcProduct.stock_quantity || 0;
                newProduct.stock_status = wcProduct.stock_status || 'instock';
                newProduct.featured = wcProduct.featured || false;
                newProduct.type = wcProduct.type || 'simple';
                
                // Handle images
                if (Array.isArray(wcProduct.images) && wcProduct.images.length > 0) {
                  newProduct.images = wcProduct.images.map(img => ({
                    src: img.src,
                    name: img.name || '',
                    alt: img.alt || ''
                  }));
                }
                
                // Handle categories
                if (Array.isArray(wcProduct.categories) && wcProduct.categories.length > 0) {
                  newProduct.categories = wcProduct.categories.map(cat => cat.name);
                }
                
                // Set WooCommerce fields
                newProduct.wc_product_id = wcProduct.id;
                newProduct.wc_sync_status = 'synced';
                newProduct.wc_last_sync_attempt = new Date();
                newProduct.wc_error = '';
                
                await this.productRepository.save(newProduct);
                addedCount++;
              }
            } catch (error: any) {
              this.logger.error(`Error processing WooCommerce product ID ${wcProduct.id}: ${error.message}`);
              failedCount++;
            }
          }
          
          // Move to next page
          page++;
          
          // Check if we should continue (if we got less than perPage items, we're done)
          if (wcProducts.length < perPage) {
            morePages = false;
          }
        } catch (error: any) {
          this.logger.error(`Error fetching products from WooCommerce (page ${page}): ${error.message}`);
          morePages = false;
          throw error;
        }
      }
        // Update last sync date for the site
      site.last_sync_date = new Date();
      await this.siteRepository.save(site);
      
      this.logger.log(`Sync completed with ${addedCount} products added, ${updatedCount} updated, ${failedCount} failed`);
      
      return {
        added: addedCount,
        updated: updatedCount,
        failed: failedCount
      };
    } catch (error: any) {
      this.logger.error(`Error syncing products from WooCommerce: ${error.message}`);
      throw error;
    }
  }

  async retrySyncFailedProducts(siteId?: number): Promise<{ success: number; failed: number; total: number }> {
    this.logger.log(`⭐ STARTING: Retry sync for failed/pending products${siteId ? ` for site ID: ${siteId}` : ''}`);
    
    // Tạo query để tìm các sản phẩm chưa đồng bộ
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.site', 'site')
      .where('product.wc_sync_status = :status', { status: 'pending' })
      .orWhere('product.wc_sync_status = :failedStatus', { failedStatus: 'failed' });
      
    // Thêm điều kiện siteId nếu được chỉ định
    if (siteId) {
      queryBuilder.andWhere('site.id = :siteId', { siteId });
    }
    
    const failedProducts = await queryBuilder.getMany();
    
    this.logger.log(`Found ${failedProducts.length} products that need to be synced with WooCommerce`);
    
    let successCount = 0;
    let failedCount = 0;
    
    // Xử lý từng sản phẩm
    for (const product of failedProducts) {
      try {
        this.logger.log(`Processing product ${product.id}: ${product.name} (WooCommerce ID: ${product.wc_product_id || 'None'})`);
        
        // Nếu chưa có ID WooCommerce, tạo mới
        if (!product.wc_product_id) {
          this.logger.log(`Creating new product in WooCommerce for product ID: ${product.id}`);
          
          // Chuyển đổi Product sang CreateProductDto
          const productDto: CreateProductDto = {
            name: product.name,
            price: product.price,
            siteId: product.site.id,
            description: product.description,
            short_description: product.short_description,
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            stock: product.stock,
            stock_status: product.stock_status,
            type: product.type || 'simple',
            featured: product.featured,
            images: product.images,
            categories: product.categories,
            attributes: product.attributes
          };
          
          const wcProduct = await ProductSyncHelper.createProduct(product.site, productDto);
          product.wc_product_id = wcProduct.id;
          product.wc_sync_status = 'synced';
          product.wc_error = ''; // Empty string instead of null
          product.wc_last_sync_attempt = new Date();
          await this.productRepository.save(product);
          successCount++;
        } else {
          // Nếu đã có ID WooCommerce, cập nhật
          this.logger.log(`Updating existing product in WooCommerce, product ID: ${product.id}, WC ID: ${product.wc_product_id}`);
          
          // Chuyển đổi Product sang UpdateProductDto
          const productDto: UpdateProductDto = {
            name: product.name,
            price: product.price,
            description: product.description,
            short_description: product.short_description,
            regular_price: product.regular_price,
            sale_price: product.sale_price,
            stock: product.stock,
            stock_status: product.stock_status || 'instock',
            type: product.type || 'simple',
            featured: product.featured,
            siteId: product.site.id,
            images: product.images || [],
            categories: product.categories || [],
            attributes: product.attributes || []
          };
          
          await ProductSyncHelper.updateProduct(product.site, product.wc_product_id, productDto);
          product.wc_sync_status = 'synced';
          product.wc_error = ''; // Empty string instead of null
          product.wc_last_sync_attempt = new Date();
          await this.productRepository.save(product);
          successCount++;
        }
      } catch (error: any) {
        failedCount++;
        product.wc_sync_status = 'failed';
        product.wc_error = error.message || 'Unknown error';
        product.wc_last_sync_attempt = new Date();
        
        // Log more detailed error information
        this.logger.error(`Failed to sync product ${product.id} [${product.name}]:`);
        this.logger.error(`Error message: ${error.message}`);
        
        if (error.response) {
          this.logger.error(`WooCommerce API response status: ${error.response.status}`);
          this.logger.error(`WooCommerce API response data: ${JSON.stringify(error.response.data || {})}`);
        }
        
        await this.productRepository.save(product);
      }
    }
    
    const result = {
      success: successCount,
      failed: failedCount,
      total: failedProducts.length
    };
    
    this.logger.log(`⭐ FINISHED: Retry sync completed - Success: ${successCount}, Failed: ${failedCount}, Total: ${failedProducts.length}`);
    return result;
  }
}
