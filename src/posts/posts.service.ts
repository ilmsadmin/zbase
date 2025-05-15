import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Site } from '../entities/site.entity';
import { SitesService } from '../sites/sites.service';
import { WordPressPostHelper } from './helpers/wordpress-post.helper';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    private sitesService: SitesService,
  ) {}

  async findAll(): Promise<Post[]> {
    this.logger.log('Finding all posts');
    return this.postRepository.find({
      relations: ['site'],
    });
  }

  async findOne(id: number): Promise<Post> {
    this.logger.log(`Finding post with id: ${id}`);
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['site'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return post;
  }
  async create(createPostDto: CreatePostDto): Promise<Post> {
    this.logger.log('Creating a new post');
    
    // Validate site if siteId is provided
    if (createPostDto.siteId) {
      const site = await this.siteRepository.findOne({
        where: { id: createPostDto.siteId }
      });
      
      if (!site) {
        throw new NotFoundException(`Site with ID ${createPostDto.siteId} not found`);
      }
      
      createPostDto.site = site;
      
      // If status is published, create on WordPress immediately
      if (createPostDto.status === 'published') {
        try {
          // Create post on WordPress
          const wpPostData = await WordPressPostHelper.createPost(site, createPostDto);
          
          // Save WordPress post ID
          createPostDto.wp_post_id = wpPostData.id;
          
          this.logger.log(`Created post on WordPress with ID: ${wpPostData.id}`);
        } catch (error) {
          this.logger.error(`Failed to create post on WordPress: ${error.message}`);
          throw new BadRequestException(`Failed to create post on WordPress: ${error.message}`);
        }
      }
    }
    
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    this.logger.log(`Updating post with id: ${id}`);
    
    const post = await this.findOne(id);
    
    // Update site reference if siteId is provided
    if (updatePostDto.siteId && (!post.site || updatePostDto.siteId !== post.site.id)) {
      const site = await this.siteRepository.findOne({
        where: { id: updatePostDto.siteId }
      });
      
      if (!site) {
        throw new NotFoundException(`Site with ID ${updatePostDto.siteId} not found`);
      }
      
      post.site = site;
    }
    
    // Sync with WordPress if status changed to published or content updated
    if (post.site && 
        (updatePostDto.status === 'published' || 
        (post.status === 'published' && 
        (updatePostDto.title !== undefined || 
         updatePostDto.content !== undefined || 
         updatePostDto.excerpt !== undefined)))) {
      
      try {
        let wpPostData;
        
        // If post already exists on WordPress, update it
        if (post.wp_post_id) {
          wpPostData = await WordPressPostHelper.updatePost(
            post.site,
            post.wp_post_id,
            { ...post, ...updatePostDto }
          );
        } else {
          // Otherwise create a new one
          wpPostData = await WordPressPostHelper.createPost(
            post.site,
            { ...post, ...updatePostDto }
          );
          post.wp_post_id = wpPostData.id;
        }
        
        this.logger.log(`Updated post on WordPress with ID: ${wpPostData.id}`);
      } catch (error) {
        this.logger.error(`Failed to update post on WordPress: ${error.message}`);
        throw new BadRequestException(`Failed to update post on WordPress: ${error.message}`);
      }
    }
    
    // Update post in database
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }
  async remove(id: number): Promise<void> {
    this.logger.log(`Removing post with id: ${id}`);
    
    const post = await this.findOne(id);
    
    // Delete from WordPress if it exists there
    if (post.site && post.wp_post_id) {
      try {
        await WordPressPostHelper.deletePost(post.site, post.wp_post_id);
        this.logger.log(`Deleted post from WordPress with ID: ${post.wp_post_id}`);
      } catch (error) {
        this.logger.error(`Failed to delete post from WordPress: ${error.message}`);
        // Continue with local deletion even if WordPress deletion fails
      }
    }
    
    await this.postRepository.remove(post);
  }

  async findBySiteId(siteId: number): Promise<Post[]> {
    this.logger.log(`Finding posts for site with id: ${siteId}`);
    
    const site = await this.siteRepository.findOne({
      where: { id: siteId }
    });
    
    if (!site) {
      throw new NotFoundException(`Site with ID ${siteId} not found`);
    }
    
    return this.postRepository.find({
      where: { site: { id: siteId } },
      relations: ['site'],
    });
  }
  async pushPosts(postIds: number[]): Promise<any> {
    this.logger.log(`Pushing posts with ids: ${postIds.join(', ')}`);
    
    if (!postIds || postIds.length === 0) {
      throw new BadRequestException('No post IDs provided');
    }
    
    // Get all posts with their site information
    const posts = await this.postRepository.find({
      where: postIds.map(id => ({ id })),
      relations: ['site']
    });
    
    if (posts.length === 0) {
      throw new NotFoundException('None of the specified posts were found');
    }
      // Track results
    const results = {
      pushed: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Push each post to its WordPress site
    for (const post of posts) {
      if (!post.site) {
        results.failed++;
        results.errors.push(`Post ${post.id} has no associated site`);
        continue;
      }
      
      try {
        let wpPostData;
        
        if (post.wp_post_id) {
          // Update existing WordPress post
          wpPostData = await WordPressPostHelper.updatePost(
            post.site,
            post.wp_post_id,
            post
          );
        } else {
          // Create new WordPress post
          wpPostData = await WordPressPostHelper.createPost(post.site, post);
          
          // Save WordPress post ID
          post.wp_post_id = wpPostData.id;
          await this.postRepository.save(post);
        }
        
        // Mark as published
        if (post.status !== 'published') {
          post.status = 'published';
          await this.postRepository.save(post);
        }
        
        results.pushed++;
        this.logger.log(`Successfully pushed post ${post.id} to ${post.site.name}`);
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to push post ${post.id}: ${error.message}`);
        this.logger.error(`Failed to push post ${post.id}: ${error.message}`);
      }
    }
    
    return { 
      success: results.pushed > 0,
      ...results
    };
  }
  async syncPosts(siteIds: number[]): Promise<any> {
    this.logger.log(`Syncing posts from sites with ids: ${siteIds.join(', ')}`);
    
    if (!siteIds || siteIds.length === 0) {
      throw new BadRequestException('No site IDs provided');
    }
    
    // Get all active sites with their posts
    const sites = await this.siteRepository.find({
      where: siteIds.map(id => ({ id })),
      relations: ['posts']
    });
    
    if (sites.length === 0) {
      throw new NotFoundException('None of the specified sites were found');
    }
      // Track results
    const results = {
      added: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Process each site
    for (const site of sites) {
      if (!site.active) {
        results.failed++;
        results.errors.push(`Site ${site.id} (${site.name}) is inactive`);
        continue;
      }
      
      try {
        // Fetch posts from WordPress
        const wpPosts = await WordPressPostHelper.fetchPosts(site);
        
        // Process each WordPress post
        for (const wpPost of wpPosts) {
          try {
            // Convert WordPress post to our format
            const postData = WordPressPostHelper.convertWordPressPost(wpPost, site);
            
            // Find if post already exists in our database by WordPress post ID
            let existingPost = await this.postRepository.findOne({
              where: {
                wp_post_id: wpPost.id,
                site: { id: site.id }
              }
            });
            
            if (existingPost) {
              // Update existing post
              Object.assign(existingPost, postData);
              await this.postRepository.save(existingPost);
              results.updated++;
            } else {
              // Create new post
              const newPost = this.postRepository.create(postData);
              await this.postRepository.save(newPost);
              results.added++;
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`Failed to process post ${wpPost.id} from ${site.name}: ${error.message}`);
            this.logger.error(`Failed to process post ${wpPost.id} from ${site.name}: ${error.message}`);
          }
        }
        
        this.logger.log(`Successfully synced posts from ${site.name}`);
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to sync posts from site ${site.id} (${site.name}): ${error.message}`);
        this.logger.error(`Failed to sync posts from site ${site.id} (${site.name}): ${error.message}`);
      }
    }
    
    return { 
      success: results.added > 0 || results.updated > 0,
      ...results
    };
  }
}
