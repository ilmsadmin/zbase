import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Site } from '../../entities/site.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../../entities/product.entity';

/**
 * Helper class for managing product synchronization with WooCommerce
 */
export class ProductSyncHelper {
  private static readonly logger = new Logger('ProductSyncHelper');

  /**
   * Create a product on WooCommerce
   */
  static async createProduct(site: Site, productData: CreateProductDto): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;
      
      // Convert our DTO to WooCommerce format
      const wcProductData: any = {
        name: productData.name,
        description: productData.description || '',
        short_description: productData.short_description || '',
        type: productData.type || 'simple',
        featured: productData.featured || false,
        stock_status: productData.stock_status || 'instock',
      };
      
      // Quản lý giá cả đúng định dạng cho WooCommerce
      if (productData.regular_price !== undefined && productData.regular_price !== null) {
        wcProductData.regular_price = productData.regular_price.toString();
      } 
      // Nếu không có regular_price nhưng có price, dùng price làm regular_price
      else if (productData.price !== undefined && productData.price !== null) {
        wcProductData.regular_price = productData.price.toString();
      }
      
      if (productData.sale_price !== undefined && 
          productData.sale_price !== null && 
          productData.sale_price > 0) {
        wcProductData.sale_price = productData.sale_price.toString();
      }
      
      // Quản lý số lượng tồn kho
      if (productData.stock !== undefined && productData.stock !== null) {
        wcProductData.stock_quantity = productData.stock;
      }
      
      // Xử lý hình ảnh và danh mục
      if (Array.isArray(productData.images) && productData.images.length > 0) {
        wcProductData.images = productData.images;
      }
      
      if (Array.isArray(productData.categories) && productData.categories.length > 0) {
        wcProductData.categories = productData.categories.map(name => ({ name }));
      }
      
      if (Array.isArray(productData.attributes) && productData.attributes.length > 0) {
        wcProductData.attributes = productData.attributes;
      }

      this.logger.debug(`Creating product on ${site.name}: ${productData.name}`);
      this.logger.debug(`WooCommerce product data: ${JSON.stringify(wcProductData)}`);
      
      try {
        this.logger.debug(`Making WooCommerce API request to ${apiUrl}`);
        this.logger.debug(`Request data: ${JSON.stringify(wcProductData)}`);
        
        const response = await axios.post(apiUrl, wcProductData, { 
          params: {
            consumer_key: site.wc_key,
            consumer_secret: site.wc_secret
          }
        });

        this.logger.debug(`Product created on WooCommerce with ID: ${response.data.id}`);
        this.logger.debug(`WooCommerce response: ${JSON.stringify(response.data)}`);
        return response.data;
      } catch (error: any) {
        // Chi tiết hơn về lỗi từ WooCommerce
        if (error.response) {
          this.logger.error(`WooCommerce API Error: ${JSON.stringify({
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
          })}`);
        }
        this.logger.error(`Error creating product on ${site.name}: ${error.message}`);
        throw error;
      }
    } catch (error: any) {
      this.logger.error(`Error in createProduct method: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a product on WooCommerce
   */
  static async updateProduct(site: Site, productId: number, productData: UpdateProductDto): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products/${productId}`;
      
      // Convert our DTO to WooCommerce format
      const wcProductData: any = {
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description,
        stock_status: productData.stock_status,
        type: productData.type,
        featured: productData.featured,
        images: productData.images,
        categories: productData.categories?.map(name => ({ name })),
        attributes: productData.attributes,
      };
      
      // Quản lý giá cả đúng định dạng cho WooCommerce
      if (productData.regular_price !== undefined && productData.regular_price !== null) {
        wcProductData.regular_price = productData.regular_price.toString();
      } 
      // Nếu không có regular_price nhưng có price, dùng price làm regular_price
      else if (productData.price !== undefined && productData.price !== null) {
        wcProductData.regular_price = productData.price.toString();
      }
      
      // Xử lý sale price
      if (productData.sale_price !== undefined && 
          productData.sale_price !== null && 
          productData.sale_price > 0) {
        wcProductData.sale_price = productData.sale_price.toString();
      }
      
      // Quản lý số lượng tồn kho
      if (productData.stock !== undefined && productData.stock !== null) {
        wcProductData.stock_quantity = productData.stock;
      }

      // Remove undefined values
      Object.keys(wcProductData).forEach(key => 
        wcProductData[key] === undefined && delete wcProductData[key]
      );
      
      this.logger.debug(`Updating product ID ${productId} on ${site.name}`);
      this.logger.debug(`WooCommerce update data: ${JSON.stringify(wcProductData)}`);
      this.logger.debug(`API URL: ${apiUrl}`);
      this.logger.debug(`Consumer Key: ${site.wc_key ? '******' : 'MISSING'}`);
      this.logger.debug(`Consumer Secret: ${site.wc_secret ? '******' : 'MISSING'}`);
      
      const response = await axios.put(apiUrl, wcProductData, { 
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret
        }
      });

      this.logger.debug(`Product updated on WooCommerce with ID: ${response.data.id}`);
      this.logger.debug(`WooCommerce update response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error updating product on ${site.name}: ${error.message}`);
      
      // Chi tiết hơn về lỗi từ WooCommerce
      if (error.response) {
        this.logger.error(`WooCommerce API Error: ${JSON.stringify({
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        })}`);
      }
      
      throw error;
    }
  }

  /**
   * Delete a product on WooCommerce
   */
  static async deleteProduct(site: Site, productId: number): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products/${productId}`;
      
      this.logger.debug(`Deleting product ID ${productId} on ${site.name}`);
      const response = await axios.delete(apiUrl, {
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret,
          force: true
        }
      });

      this.logger.debug(`Product deleted on WooCommerce with ID: ${productId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error deleting product on ${site.name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetch products from WooCommerce
   * @param site The site to fetch products from
   * @param page Page number for pagination
   * @param perPage Number of products per page
   * @returns Array of WooCommerce products
   */
  static async fetchProductsFromWooCommerce(site: Site, page: number = 1, perPage: number = 20): Promise<any[]> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;
      
      this.logger.log(`Fetching products from ${site.name} (${site.wp_url}), page ${page}`);
      this.logger.log(`WooCommerce API URL: ${apiUrl}`);
      this.logger.log(`Using consumer_key: ${site.wc_key ? site.wc_key.substring(0, 4) + '...' : 'MISSING'}`);
      this.logger.log(`Using consumer_secret: ${site.wc_secret ? site.wc_secret.substring(0, 4) + '...' : 'MISSING'}`);
      
      // First check WooCommerce response with a small page size to diagnose any issues
      if (page === 1) {
        try {
          const testResponse = await axios.get(apiUrl, {
            params: {
              consumer_key: site.wc_key,
              consumer_secret: site.wc_secret,
              page: 1,
              per_page: 1
            },
            timeout: 10000
          });
          
          this.logger.log(`WooCommerce test response successful. Status: ${testResponse.status}`);
          
          // Log headers to check total products available
          const totalProducts = testResponse.headers['x-wp-total'];
          const totalPages = testResponse.headers['x-wp-totalpages'];
          
          if (totalProducts && totalPages) {
            this.logger.log(`WooCommerce reports ${totalProducts} total products across ${totalPages} pages`);
          }
        } catch (testError) {
          this.logger.error(`WooCommerce test request failed: ${testError.message}`);
          throw testError;
        }
      }
      
      // Proceed with actual request
      const response = await axios.get(apiUrl, {
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret,
          page,
          per_page: perPage,
          status: 'publish'
        },
        timeout: 15000 // Set timeout to 15 seconds
      });

      // Check response type and structure
      if (!response.data) {
        this.logger.error('WooCommerce API returned empty response');
        return [];
      }
      
      // Check if response is array (expected) or something else
      if (!Array.isArray(response.data)) {
        this.logger.warn(`WooCommerce API returned non-array response: ${typeof response.data}`);
        this.logger.warn(`Response data sample: ${JSON.stringify(response.data).substring(0, 200)}...`);
        
        // Some WooCommerce installations might return an object with a products property
        if (response.data.products && Array.isArray(response.data.products)) {
          this.logger.log(`Found products array in response: ${response.data.products.length} items`);
          return response.data.products;
        }
        
        if (typeof response.data === 'object') {
          this.logger.warn('Attempting to convert response to array if possible');
          return Object.values(response.data);
        }
        
        return [];
      }
      
      this.logger.log(`Fetched ${response.data.length} products from WooCommerce for site ${site.name}`);
      
      // Log first product to help with debugging
      if (response.data.length > 0) {
        const sampleProduct = response.data[0];
        this.logger.log(`Sample product: ID=${sampleProduct.id}, Name=${sampleProduct.name}`);
      }
      
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error fetching products from ${site.name}: ${error.message}`);
      
      // Detailed error logging
      if (error.response) {
        this.logger.error(`WooCommerce API Error Status: ${error.response.status}`);
        this.logger.error(`WooCommerce API Error Status Text: ${error.response.statusText}`);
        
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            this.logger.error(`WooCommerce API Error Data: ${error.response.data.substring(0, 200)}...`);
          } else {
            this.logger.error(`WooCommerce API Error Data: ${JSON.stringify(error.response.data).substring(0, 200)}...`);
          }
        }
      } else if (error.request) {
        // Request was made but no response received
        this.logger.error('WooCommerce API request sent but no response received');
      } else {
        // Something happened in setting up the request
        this.logger.error(`WooCommerce API request setup error: ${error.message}`);
      }
      
      throw error;
    }
  }
}
