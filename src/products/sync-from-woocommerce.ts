import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'type                newProduct.sale_price = wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : 0;rm';
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

  // ... other methods will be kept the same ...

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
                
                // Handle price carefully - parse string values to float
                if (wcProduct.price) {
                  existingProduct.price = parseFloat(wcProduct.price);
                } else if (wcProduct.regular_price) {
                  existingProduct.price = parseFloat(wcProduct.regular_price);
                }
                
                if (wcProduct.regular_price) {
                  existingProduct.regular_price = parseFloat(wcProduct.regular_price);
                }
                
                // Handle sale price - can be null
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
                this.logger.log(`Creating new product from WooCommerce: ${wcProduct.name} (WC ID: ${wcProduct.id})`);
                
                const newProduct = new Product();
                newProduct.site = site;
                newProduct.name = wcProduct.name;
                newProduct.description = wcProduct.description;
                newProduct.short_description = wcProduct.short_description;
                
                // Handle price carefully - parse string values to float
                if (wcProduct.price) {
                  newProduct.price = parseFloat(wcProduct.price);
                } else if (wcProduct.regular_price) {
                  newProduct.price = parseFloat(wcProduct.regular_price);
                } else {
                  newProduct.price = 0; // Default price if none provided
                }
                
                if (wcProduct.regular_price) {
                  newProduct.regular_price = parseFloat(wcProduct.regular_price);
                }
                
                // Handle sale price - can be null
                newProduct.sale_price = wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : 0;
                
                newProduct.stock = wcProduct.stock_quantity || 0;
                newProduct.stock_status = wcProduct.stock_status || 'instock';
                newProduct.featured = wcProduct.featured || false;
                newProduct.type = wcProduct.type || 'simple';
                
                // Initialize arrays to prevent null values
                newProduct.images = [];
                newProduct.categories = [];
                
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
            } catch (productError) {
              this.logger.error(`Error processing WooCommerce product ID ${wcProduct.id}: ${productError.message}`);
              failedCount++;
            }
          }
          
          // Move to next page
          page++;
          
          // Check if we should continue (if we got less than perPage items, we're done)
          if (wcProducts.length < perPage) {
            this.logger.log(`Received fewer products (${wcProducts.length}) than requested (${perPage}), assuming last page`);
            morePages = false;
          }
        } catch (pageError) {
          this.logger.error(`Error fetching products from WooCommerce (page ${page}): ${pageError.message}`);
          morePages = false;
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
}
