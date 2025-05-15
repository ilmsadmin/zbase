import { Logger } from '@nestjs/common';
import axios from 'axios';
import { Post } from '../../entities/post.entity';
import { Site } from '../../entities/site.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

/**
 * Helper class for working with WordPress posts API
 */
export class WordPressPostHelper {
  private static logger = new Logger('WordPressPostHelper');

  /**
   * Create authentication headers for WordPress API
   */
  private static createAuthHeaders(username: string, password: string) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    return { Authorization: `Basic ${auth}` };
  }

  /**
   * Fetch posts from WordPress site
   * @param site WordPress site entity
   * @param perPage Number of posts to fetch per page
   * @param page Page number
   * @returns List of WordPress posts
   */
  static async fetchPosts(site: Site, perPage = 20, page = 1): Promise<any[]> {
    try {
      if (!site.wp_url || !site.wp_user || !site.app_password) {
        throw new Error('Site is missing WordPress credentials');
      }

      const headers = this.createAuthHeaders(site.wp_user, site.app_password);
      const url = `${site.wp_url}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&_embed=true`;

      this.logger.debug(`Fetching posts from ${url}`);
      const response = await axios.get(url, { headers });

      this.logger.debug(`Fetched ${response.data.length} posts from ${site.name}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching posts from ${site?.name}: ${error.message}`);
      throw new Error(`Cannot fetch posts from ${site?.name}: ${error.message}`);
    }
  }

  /**
   * Create a new post on WordPress site
   * @param site WordPress site entity
   * @param post Post data to create
   * @returns Created WordPress post data
   */
  static async createPost(site: Site, post: CreatePostDto | Post): Promise<any> {
    try {
      if (!site.wp_url || !site.wp_user || !site.app_password) {
        throw new Error('Site is missing WordPress credentials');
      }

      const headers = this.createAuthHeaders(site.wp_user, site.app_password);
      const url = `${site.wp_url}/wp-json/wp/v2/posts`;

      // Prepare post data in WordPress format
      const wpPost = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status === 'published' ? 'publish' : (post.status || 'draft'),
        slug: post.slug
      };

      this.logger.debug(`Creating post on ${site.name}: ${post.title}`);
      const response = await axios.post(url, wpPost, { headers });

      this.logger.debug(`Created post with WordPress ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error creating post on ${site?.name}: ${error.message}`);
      throw new Error(`Cannot create post on ${site?.name}: ${error.message}`);
    }
  }

  /**
   * Update an existing post on WordPress site
   * @param site WordPress site entity
   * @param wpPostId WordPress post ID
   * @param post Post data to update
   * @returns Updated WordPress post data
   */
  static async updatePost(site: Site, wpPostId: number, post: UpdatePostDto | Post): Promise<any> {
    try {
      if (!site.wp_url || !site.wp_user || !site.app_password) {
        throw new Error('Site is missing WordPress credentials');
      }

      const headers = this.createAuthHeaders(site.wp_user, site.app_password);
      const url = `${site.wp_url}/wp-json/wp/v2/posts/${wpPostId}`;

      // Prepare post data in WordPress format
      const wpPost = {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || '',
        status: post.status === 'published' ? 'publish' : (post.status || 'draft'),
        slug: post.slug
      };

      this.logger.debug(`Updating post on ${site.name} with WordPress ID: ${wpPostId}`);
      const response = await axios.put(url, wpPost, { headers });

      this.logger.debug(`Updated post with WordPress ID: ${response.data.id}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error updating post on ${site?.name}: ${error.message}`);
      throw new Error(`Cannot update post on ${site?.name}: ${error.message}`);
    }
  }

  /**
   * Delete a post from WordPress site
   * @param site WordPress site entity
   * @param wpPostId WordPress post ID
   * @returns Result of deletion operation
   */
  static async deletePost(site: Site, wpPostId: number): Promise<any> {
    try {
      if (!site.wp_url || !site.wp_user || !site.app_password) {
        throw new Error('Site is missing WordPress credentials');
      }

      const headers = this.createAuthHeaders(site.wp_user, site.app_password);
      // Force=true to permanently delete instead of moving to trash
      const url = `${site.wp_url}/wp-json/wp/v2/posts/${wpPostId}?force=true`;

      this.logger.debug(`Deleting post from ${site.name} with WordPress ID: ${wpPostId}`);
      const response = await axios.delete(url, { headers });

      this.logger.debug(`Deleted post with WordPress ID: ${wpPostId}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error deleting post from ${site?.name}: ${error.message}`);
      throw new Error(`Cannot delete post from ${site?.name}: ${error.message}`);
    }
  }

  /**
   * Convert WordPress post object to our Post entity format
   * @param wpPost WordPress post object
   * @param site Site entity
   * @returns Post entity data
   */
  static convertWordPressPost(wpPost: any, site: Site): Partial<Post> {    // Extract featured image if available
    let featuredImage: string | undefined = undefined;
    if (wpPost._embedded && 
        wpPost._embedded['wp:featuredmedia'] && 
        wpPost._embedded['wp:featuredmedia'][0]) {
      featuredImage = wpPost._embedded['wp:featuredmedia'][0].source_url;
    }

    // Format categories and tags
    const categories = wpPost._embedded && 
      wpPost._embedded['wp:term'] && 
      wpPost._embedded['wp:term'][0] ? 
      wpPost._embedded['wp:term'][0].map(term => term.name) : [];

    const tags = wpPost._embedded && 
      wpPost._embedded['wp:term'] && 
      wpPost._embedded['wp:term'][1] ? 
      wpPost._embedded['wp:term'][1].map(term => term.name) : [];

    // Determine author name if available
    const authorName = wpPost._embedded && 
      wpPost._embedded.author && 
      wpPost._embedded.author[0] ? 
      wpPost._embedded.author[0].name : null;

    return {
      wp_post_id: wpPost.id,
      title: wpPost.title.rendered,
      slug: wpPost.slug,
      content: wpPost.content.rendered,
      excerpt: wpPost.excerpt.rendered,
      status: wpPost.status,
      meta: {
        meta_title: wpPost.title.rendered,
        meta_description: wpPost.excerpt.rendered,
        featured_image: featuredImage
      },
      categories: categories,
      tags: tags,
      site: site,
      created_at: new Date(wpPost.date),
      updated_at: new Date(wpPost.modified)
    };
  }
}
