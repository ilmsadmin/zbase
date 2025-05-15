import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from '../entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteHelpers } from './helpers/site.helpers';

@Injectable()
export class SitesService {  private readonly logger = new Logger(SitesService.name);
  private _lastConnectionResult: { success: boolean, version?: string, info?: any } = { success: false };

  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
  ) {}
  
  // Get the last connection test result
  getLastConnectionResult() {
    return this._lastConnectionResult;
  }
  async findAll(): Promise<Site[]> {
    this.logger.log('Finding all sites');
    return this.siteRepository.find();
  }
    async findAllWithPagination(
    page: number = 1, 
    limit: number = 10,
    search: string = '',
    sortBy: string = 'id',
    status: string = '',
    hasWoocommerce?: boolean
  ): Promise<{sites: Site[], totalItems: number, totalPages: number}> {
    this.logger.log(`Finding sites with pagination: page=${page}, limit=${limit}, search=${search}`);
    
    const queryBuilder = this.siteRepository.createQueryBuilder('site')
      .leftJoinAndSelect('site.posts', 'posts');
    
    // Apply search filter
    if (search) {
      queryBuilder.andWhere('(site.name LIKE :search OR site.wp_url LIKE :search)', 
        { search: `%${search}%` });
    }
      // Apply status filter
    if (status) {
      if (status === 'active') {
        queryBuilder.andWhere('site.active = :active', { active: true });
      } else if (status === 'inactive') {
        queryBuilder.andWhere('site.active = :active', { active: false });
      }
    }
    
    // Filter by WooCommerce availability if specified
    if (hasWoocommerce !== undefined) {
      queryBuilder.andWhere('site.has_woocommerce = :hasWoocommerce', { hasWoocommerce });
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'name':
        queryBuilder.orderBy('site.name', 'ASC');
        break;
      case 'url':
        queryBuilder.orderBy('site.wp_url', 'ASC');
        break;
      case 'created':
        queryBuilder.orderBy('site.created_at', 'DESC');
        break;
      default:
        queryBuilder.orderBy('site.id', 'ASC');
    }
    
    // Get total count for pagination
    const totalItems = await queryBuilder.getCount();
    
    // Apply pagination
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit);
    
    const sites = await queryBuilder.getMany();
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);
    
    return {
      sites,
      totalItems,
      totalPages
    };
  }
  async findOne(id: number): Promise<Site> {
    this.logger.log(`Finding site with id: ${id}`);
    const site = await this.siteRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException(`Site with ID ${id} not found`);
    }
    return site;
  }
  async create(createSiteDto: CreateSiteDto): Promise<Site> {
    this.logger.log('Creating a new site');
    this.logger.debug('Site creation DTO:', JSON.stringify(createSiteDto));
    
    // Test connection before creating
    await this.testConnection(createSiteDto);
    
    const site = this.siteRepository.create(createSiteDto);
    this.logger.debug('Site entity before save:', JSON.stringify(site));
    
    const savedSite = await this.siteRepository.save(site);
    this.logger.debug('Site saved successfully with ID:', savedSite.id);
    this.logger.debug('Saved site WordPress URL:', savedSite.wp_url);
    
    return savedSite;
  }
  async update(id: number, updateSiteDto: UpdateSiteDto): Promise<Site> {
    this.logger.log(`Updating site with id: ${id}`);
    this.logger.debug('Site update DTO:', JSON.stringify(updateSiteDto));
    
    const site = await this.findOne(id);
    this.logger.debug('Current site data:', JSON.stringify(site));
    
    // If WP credentials or WooCommerce keys are being updated, test connection
    if (this.shouldTestConnection(updateSiteDto, site)) {
      await this.testConnection({ ...site, ...updateSiteDto });
    }
    
    Object.assign(site, updateSiteDto);
    this.logger.debug('Site after assign:', JSON.stringify(site));
    
    const savedSite = await this.siteRepository.save(site);
    this.logger.debug('Site updated successfully:', savedSite.id);
    this.logger.debug('Updated site WordPress URL:', savedSite.wp_url);
    
    return savedSite;
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing site with id: ${id}`);
    const site = await this.findOne(id);
    await this.siteRepository.remove(site);
  }  async testConnection(siteData: CreateSiteDto | Site): Promise<boolean> {
    this.logger.log('Testing site connection');    // Test WordPress connection
    if (siteData.wp_url && siteData.wp_user && siteData.app_password) {
      try {
        const wpConnectionResult = await SiteHelpers.testWordPressConnection(
          siteData.wp_url,
          siteData.wp_user,
          siteData.app_password
        );
        
        this.logger.log(`WordPress connection successful, version: ${wpConnectionResult.version || 'unknown'}`);
        
        // Store the connection result for the controller to use
        this._lastConnectionResult = wpConnectionResult;
      } catch (error) {
        this.logger.error(`WordPress connection failed: ${error.message}`);
        throw error;
      }
    }
    
    // Test WooCommerce connection if credentials are provided
    if (siteData.has_woocommerce && siteData.wc_key && siteData.wc_secret) {
      const wooConnected = await SiteHelpers.testWooCommerceConnection(
        siteData.wp_url,
        siteData.wc_key,
        siteData.wc_secret
      );
      
      if (!wooConnected) {
        throw new Error('Cannot connect to WooCommerce store');
      }
      
      this.logger.log('WooCommerce connection successful');
    }
    
    return true;
  }
    private shouldTestConnection(updateDto: UpdateSiteDto, currentSite: Site): boolean {
    // Test connection if any of these credentials are being changed
    return (
      (updateDto.wp_url !== undefined && updateDto.wp_url !== currentSite.wp_url) ||
      (updateDto.wp_user !== undefined && updateDto.wp_user !== currentSite.wp_user) ||
      (updateDto.app_password !== undefined && updateDto.app_password !== currentSite.app_password) ||
      (updateDto.wc_key !== undefined && updateDto.wc_key !== currentSite.wc_key) ||
      (updateDto.wc_secret !== undefined && updateDto.wc_secret !== currentSite.wc_secret)
    );
  }

  async getSiteStatistics(siteId: number) {
    const site = await this.siteRepository.findOne({
      where: { id: siteId },
      relations: ['posts']
    });

    if (!site) {
      throw new NotFoundException('Site not found');
    }    return {
      posts_count: site.posts?.length || 0,
      products_count: 0, // Implement product count if needed
      last_sync: site.last_sync_date || null
    };
  }
}