import { Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import * as OAuth from 'oauth-1.0a';
import * as querystring from 'querystring';
import { Site } from '../../entities/site.entity';
import { Product } from '../../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

/**
 * Helper class for working with WooCommerce API
 */
export class WooCommerceProductHelper {
  private static logger = new Logger('WooCommerceProductHelper');

  /**
   * Create OAuth1.0a headers for WooCommerce REST API
   */
  private static createOAuthHeaders(
    method: string,
    url: string,
    data: any,
    consumerKey: string,
    consumerSecret: string,
  ): { [key: string]: string } {
    const oauth = new OAuth({
      consumer: { key: consumerKey, secret: consumerSecret },
      signature_method: 'HMAC-SHA256',
      hash_function(baseString: string, key: string) {
        return crypto.createHmac('sha256', key).update(baseString).digest('base64');
      },
    });

    const requestData = {
      url,
      method,
      data,
    };

    return oauth.toHeader(oauth.authorize(requestData));
  }

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

      // Prepare OAuth headers
      const headers = this.createOAuthHeaders('GET', apiUrl, {}, consumerKey, consumerSecret);

      this.logger.debug(`Testing WooCommerce connection to ${apiUrl}`);
      const response = await axios.get(apiUrl, { headers });

      // If we can get products, connection is successful
      if (response.status === 200) {
        // Get store info to verify it's working correctly
        const storeUrl = `${baseUrl}wp-json/wc/v3/system_status`;
        const storeResponse = await axios.get(storeUrl, { 
          headers: this.createOAuthHeaders('GET', storeUrl, {}, consumerKey, consumerSecret) 
        });

        return {
          success: true,
          version: storeResponse?.data?.environment?.version || 'Unknown',
          info: {
            productCount: response.headers['x-wp-total'] || 0,
            storeDetails: {
              name: storeResponse?.data?.environment?.name || 'WooCommerce Store',
              platform: storeResponse?.data?.environment?.platform || 'WordPress',
              wpVersion: storeResponse?.data?.environment?.wp_version || 'Unknown',
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
          errorResponse: error.response?.data || {} 
        }
      };
    }
  }

  /**
   * Fetch products from WooCommerce
   */
  static async fetchProducts(site: Site, perPage = 20, page = 1): Promise<any[]> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;
      const queryParams = querystring.stringify({ per_page: perPage, page });
      const url = `${apiUrl}?${queryParams}`;

      const headers = this.createOAuthHeaders('GET', url, {}, site.wc_key, site.wc_secret);

      this.logger.debug(`Fetching products from ${url}`);
      const response = await axios.get(url, { headers });

      this.logger.debug(`Fetched ${response.data.length} products from ${site.name}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching products from ${site.name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Convert WooCommerce product to our Product entity
   */
  static convertWooCommerceProduct(wcProduct: any, site: Site): Partial<Product> {
    return {
      wc_product_id: wcProduct.id,
      name: wcProduct.name,
      description: wcProduct.description,
      short_description: wcProduct.short_description,
      price: wcProduct.price,
      regular_price: wcProduct.regular_price,
      sale_price: wcProduct.sale_price,
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
      attributes: wcProduct.attributes?.map((attr: any) => ({
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
  static async createProduct(site: Site, productData: CreateProductDto): Promise<any> {
    try {
      if (!site.wp_url || !site.wc_key || !site.wc_secret) {
        throw new Error('Site is missing WooCommerce API credentials');
      }

      const baseUrl = site.wp_url.endsWith('/') ? site.wp_url : `${site.wp_url}/`;
      const apiUrl = `${baseUrl}wp-json/wc/v3/products`;
      
      // Convert our DTO to WooCommerce format
      const wcProductData = {
        name: productData.name,
        description: productData.description || '',
        short_description: productData.short_description || '',
        regular_price: productData.regular_price?.toString() || productData.price?.toString(),
        sale_price: productData.sale_price?.toString() || '',
        price: productData.price?.toString(),
        stock_quantity: productData.stock || 0,
        stock_status: productData.stock_status || 'instock',
        type: productData.type || 'simple',
        featured: productData.featured || false,
        images: productData.images || [],
        categories: productData.categories?.map(name => ({ name })) || [],
        attributes: productData.attributes || [],
      };

      const headers = this.createOAuthHeaders('POST', apiUrl, wcProductData, site.wc_key, site.wc_secret);

      this.logger.debug(`Creating product on ${site.name}: ${productData.name}`);
      const response = await axios.post(apiUrl, wcProductData, { headers });

      this.logger.debug(`Product created on WooCommerce with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating product on ${site.name}: ${error.message}`);
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
      const wcProductData = {
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description,
        regular_price: productData.regular_price?.toString(),
        sale_price: productData.sale_price?.toString(),
        price: productData.price?.toString(),
        stock_quantity: productData.stock,
        stock_status: productData.stock_status,
        type: productData.type,
        featured: productData.featured,
        images: productData.images,
        categories: productData.categories?.map(name => ({ name })),
        attributes: productData.attributes,
      };

      // Remove undefined values
      Object.keys(wcProductData).forEach(key => 
        wcProductData[key] === undefined && delete wcProductData[key]
      );

      const headers = this.createOAuthHeaders('PUT', apiUrl, wcProductData, site.wc_key, site.wc_secret);

      this.logger.debug(`Updating product ID ${productId} on ${site.name}`);
      const response = await axios.put(apiUrl, wcProductData, { headers });

      this.logger.debug(`Product updated on WooCommerce with ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating product on ${site.name}: ${error.message}`);
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
      const apiUrl = `${baseUrl}wp-json/wc/v3/products/${productId}?force=true`;
      
      const headers = this.createOAuthHeaders('DELETE', apiUrl, {}, site.wc_key, site.wc_secret);

      this.logger.debug(`Deleting product ID ${productId} on ${site.name}`);
      const response = await axios.delete(apiUrl, { headers });

      this.logger.debug(`Product deleted on WooCommerce with ID: ${productId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error deleting product on ${site.name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Sync all products from WooCommerce to our database
   */
  static async syncProductsFromWooCommerce(site: Site): Promise<any[]> {
    const allWcProducts = [];
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

      this.logger.debug(`Fetched a total of ${allWcProducts.length} products from ${site.name}`);
      return allWcProducts;
    } catch (error) {
      this.logger.error(`Error syncing products from ${site.name}: ${error.message}`);
      throw error;
    }
  }
}
