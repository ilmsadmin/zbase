import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as querystring from 'querystring';
import { Site } from '../../entities/site.entity';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

/**
 * Helper class for working with WooCommerce REST API
 */
export class WooCommerceProductHelper {
  private static logger = new Logger('WooCommerceProductHelper');

  /**
   * Test connection to WooCommerce API
   */
  static async testWooCommerceConnection(
    siteUrl: string,
    consumerKey: string,
    consumerSecret: string,
  ): Promise<{ success: boolean; version?: string; info?: any }> {
    try {
      // Ensure URL ends with / for WooCommerce API
      const baseUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;

      this.logger.debug(`Testing WooCommerce connection to ${apiUrl}`);
      const response = await axios.get(apiUrl, {
        params: {
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
          per_page: 1,
        },
      });

      // If we can get products, connection is successful
      if (response.status === 200) {
        // Get store info to verify it's working correctly
        const storeUrl = `${baseUrl}wp-json/wc/v3/system_status`;
        const storeResponse = await axios.get(storeUrl, {
          params: {
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
          },
        });

        return {
          success: true,
          version: storeResponse?.data?.environment?.version || 'Unknown',
          info: {
            productCount: response.headers['x-wp-total'] || 0,
            storeDetails: {
              name:
                storeResponse?.data?.environment?.name || 'WooCommerce Store',
              platform:
                storeResponse?.data?.environment?.platform || 'WordPress',
              wpVersion:
                storeResponse?.data?.environment?.wp_version || 'Unknown',
            },
          },
        };
      }

      return { success: false };
    } catch (error) {
      this.logger.error(`WooCommerce connection test failed: ${error.message}`);
      return {
        success: false,
        info: {
          errorMessage: error.message,
          statusCode: error.response?.status || 'Unknown',
          errorResponse: error.response?.data || {},
        },
      };
    }
  }

  /**
   * Fetch products from WooCommerce
   */
  static async fetchProducts(
    site: Site,
    perPage = 20,
    page = 1,
  ): Promise<any[]> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/')
        ? site.wp_url
        : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;

      this.logger.debug(`Fetching products from ${apiUrl}, page ${page}`);
      const response = await axios.get(apiUrl, {
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret,
          per_page: perPage,
          page: page,
        },
      });

      this.logger.debug(
        `Fetched ${response.data.length} products from ${site.name}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error fetching products from ${site.name}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Convert WooCommerce product to our Product entity
   */
  static convertWooCommerceProduct(
    wcProduct: any,
    site: Site,
  ): Partial<Product> {
    return {
      wc_product_id: wcProduct.id,
      name: wcProduct.name,
      description: wcProduct.description,
      short_description: wcProduct.short_description,
      price: wcProduct.price ? parseFloat(wcProduct.price) : 0,
      regular_price: wcProduct.regular_price
        ? parseFloat(wcProduct.regular_price)
        : undefined,
      sale_price: wcProduct.sale_price
        ? parseFloat(wcProduct.sale_price)
        : undefined,
      stock: wcProduct.stock_quantity || 0,
      stock_status: wcProduct.stock_status || 'instock',
      type: wcProduct.type || 'simple',
      featured: wcProduct.featured || false,
      images: wcProduct.images.map((img: any) => ({
        src: img.src,
        name: img.name || '',
        alt: img.alt || '',
      })),
      categories: wcProduct.categories?.map((cat: any) => cat.name) || [],
      attributes:
        wcProduct.attributes?.map((attr: any) => ({
          name: attr.name,
          options: attr.options || [],
          visible: attr.visible || false,
        })) || [],
      site: site,
    };
  }

  /**
   * Create a product on WooCommerce
   */
  static async createProduct(
    site: Site,
    productData: CreateProductDto,
  ): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/')
        ? site.wp_url
        : `${site.wp_url}/`;
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
      if (
        productData.regular_price !== undefined &&
        productData.regular_price !== null
      ) {
        wcProductData.regular_price = productData.regular_price.toString();
      }
      // Nếu không có regular_price nhưng có price, dùng price làm regular_price
      else if (productData.price !== undefined && productData.price !== null) {
        wcProductData.regular_price = productData.price.toString();
      }

      if (
        productData.sale_price !== undefined &&
        productData.sale_price !== null &&
        productData.sale_price > 0
      ) {
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

      if (
        Array.isArray(productData.categories) &&
        productData.categories.length > 0
      ) {
        wcProductData.categories = productData.categories.map((name) => ({
          name,
        }));
      }
      if (
        Array.isArray(productData.attributes) &&
        productData.attributes.length > 0
      ) {
        wcProductData.attributes = productData.attributes;
      }

      this.logger.debug(
        `Creating product on ${site.name}: ${productData.name}`,
      );
      this.logger.debug(
        `WooCommerce product data: ${JSON.stringify(wcProductData)}`,
      );
      try {
        this.logger.debug(`Making WooCommerce API request to ${apiUrl}`);
        this.logger.debug(`Request data: ${JSON.stringify(wcProductData)}`);

        const response = await axios.post(apiUrl, wcProductData, {
          params: {
            consumer_key: site.wc_key,
            consumer_secret: site.wc_secret,
          },
        });

        this.logger.debug(
          `Product created on WooCommerce with ID: ${response.data.id}`,
        );
        this.logger.debug(
          `WooCommerce response: ${JSON.stringify(response.data)}`,
        );
        return response.data;
      } catch (error) {
        // Chi tiết hơn về lỗi từ WooCommerce
        if (error.response) {
          this.logger.error(
            `WooCommerce API Error: ${JSON.stringify({
              status: error.response.status,
              statusText: error.response.statusText,
              data: error.response.data,
            })}`,
          );
        }
        this.logger.error(
          `Error creating product on ${site.name}: ${error.message}`,
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(`Error in createProduct method: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a product on WooCommerce
   */
  static async updateProduct(
    site: Site,
    productId: number,
    productData: UpdateProductDto,
  ): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/')
        ? site.wp_url
        : `${site.wp_url}/`;
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
        categories: productData.categories?.map((name) => ({ name })),
        attributes: productData.attributes,
      };

      // Quản lý giá cả đúng định dạng cho WooCommerce
      if (
        productData.regular_price !== undefined &&
        productData.regular_price !== null
      ) {
        wcProductData.regular_price = productData.regular_price.toString();
      }
      // Nếu không có regular_price nhưng có price, dùng price làm regular_price
      else if (productData.price !== undefined && productData.price !== null) {
        wcProductData.regular_price = productData.price.toString();
      }

      // Xử lý sale price
      if (
        productData.sale_price !== undefined &&
        productData.sale_price !== null &&
        productData.sale_price > 0
      ) {
        wcProductData.sale_price = productData.sale_price.toString();
      }
      // Quản lý số lượng tồn kho
      if (productData.stock !== undefined && productData.stock !== null) {
        wcProductData.stock_quantity = productData.stock;
      } // Remove undefined values
      Object.keys(wcProductData).forEach(
        (key) => wcProductData[key] === undefined && delete wcProductData[key],
      );

      this.logger.debug(`Updating product ID ${productId} on ${site.name}`);
      this.logger.debug(
        `WooCommerce update data: ${JSON.stringify(wcProductData)}`,
      );
      this.logger.debug(`API URL: ${apiUrl}`);
      this.logger.debug(`Consumer Key: ${site.wc_key ? '******' : 'MISSING'}`);
      this.logger.debug(
        `Consumer Secret: ${site.wc_secret ? '******' : 'MISSING'}`,
      );

      const response = await axios.put(apiUrl, wcProductData, {
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret,
        },
      });

      this.logger.debug(
        `Product updated on WooCommerce with ID: ${response.data.id}`,
      );
      this.logger.debug(
        `WooCommerce update response: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error updating product on ${site.name}: ${error.message}`,
      );

      // Chi tiết hơn về lỗi từ WooCommerce
      if (error.response) {
        this.logger.error(
          `WooCommerce API Error: ${JSON.stringify({
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
          })}`,
        );
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

      const baseUrl = site.wp_url.endsWith('/')
        ? site.wp_url
        : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products/${productId}`;

      this.logger.debug(`Deleting product ID ${productId} on ${site.name}`);
      const response = await axios.delete(apiUrl, {
        params: {
          consumer_key: site.wc_key,
          consumer_secret: site.wc_secret,
          force: true,
        },
      });

      this.logger.debug(`Product deleted on WooCommerce with ID: ${productId}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error deleting product on ${site.name}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Sync all products from WooCommerce to our database
   */ static async syncProductsFromWooCommerce(site: Site): Promise<any[]> {
    const allWcProducts: any[] = [];
    let page = 1;
    const perPage = 100;
    let hasMoreProducts = true;

    try {
      while (hasMoreProducts) {
        const wcProducts = await this.fetchProducts(site, perPage, page);
        allWcProducts.push(...wcProducts);

        // Check if we've reached the end
        if (wcProducts.length < perPage) {
          hasMoreProducts = false;
        } else {
          page++;
        }
      }

      this.logger.debug(
        `Fetched a total of ${allWcProducts.length} products from ${site.name}`,
      );
      return allWcProducts;
    } catch (error) {
      this.logger.error(
        `Error syncing products from ${site.name}: ${error.message}`,
      );
      throw error;
    }
  }
}
