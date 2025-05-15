import { Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * Helper class for working with WordPress and WooCommerce API
 */
export class SiteHelpers {
  private static logger = new Logger('SiteHelpers');
  /**
   * Test WordPress API connection
   * @param url WordPress site URL
   * @param username WordPress username
   * @param password WordPress application password
   * @returns true if connection is successful
   */  static async testWordPressConnection(url: string, username: string, password: string): Promise<{success: boolean, version?: string, info?: any}> {
    try {
      const auth = Buffer.from(`${username}:${password}`).toString('base64');
      const headers = { Authorization: `Basic ${auth}` };
      
      // First, try to get WordPress version from the main API
      try {
        const wpRootUrl = `${url}/wp-json`;
        const rootResponse = await axios.get(wpRootUrl, { headers });
        const version = rootResponse.data?.version;
        const siteInfo = {
          name: rootResponse.data?.name,
          description: rootResponse.data?.description,
          url: rootResponse.data?.url
        };
        
        // Important: Test an authenticated endpoint to verify credentials
        // We use /wp/v2/users/me which requires authentication
        const authEndpoint = `${url}/wp-json/wp/v2/users/me`;
        try {
          const authResponse = await axios.get(authEndpoint, { headers });
          
          if (!authResponse.data || !authResponse.data.id) {
            throw new Error('Authentication failed: Could not verify user identity');
          }
          
          this.logger.debug(`WordPress authentication test successful for ${url}, user ID: ${authResponse.data.id}`);
          
          return { 
            success: true, 
            version,
            info: {
              ...siteInfo,
              authenticatedUser: authResponse.data.name || username
            }
          };
        } catch (authError) {
          this.logger.error(`WordPress authentication failed: ${authError.message}`);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
      } catch (versionError) {
        // If we can't get root data, try an authenticated endpoint directly
        this.logger.warn(`Could not get WordPress version: ${versionError.message}`);
        
        // Try users/me endpoint which requires authentication
        const authEndpoint = `${url}/wp-json/wp/v2/users/me`;
        try {
          const authResponse = await axios.get(authEndpoint, { headers });
          
          if (!authResponse.data || !authResponse.data.id) {
            throw new Error('Authentication failed: Could not verify user identity');
          }
          
          this.logger.debug(`WordPress authentication successful for ${url}, but version unknown`);
          return { 
            success: true,
            info: {
              authenticatedUser: authResponse.data.name || username
            }
          };
        } catch (authError) {
          this.logger.error(`WordPress authentication failed: ${authError.message}`);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
      }
    } catch (error) {
      this.logger.error(`WordPress connection test failed for ${url}: ${error.message}`);
      throw new Error(`Cannot connect to WordPress site at ${url}: ${error.message}`);
    }
  }

  /**
   * Test WooCommerce API connection
   * @param url WordPress site URL
   * @param key WooCommerce consumer key
   * @param secret WooCommerce consumer secret
   * @returns true if connection is successful
   */
  static async testWooCommerceConnection(url: string, key: string, secret: string): Promise<boolean> {
    try {
      const wcUrl = `${url}/wp-json/wc/v3/products?per_page=1`;
      
      await axios.get(wcUrl, {
        params: {
          consumer_key: key,
          consumer_secret: secret
        }
      });
      this.logger.debug(`WooCommerce connection test successful for ${url}`);
      return true;
    } catch (error) {
      this.logger.error(`WooCommerce connection test failed for ${url}: ${error.message}`);
      return false;
    }
  }
}
