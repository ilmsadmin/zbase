import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Site } from '../entities/site.entity';
import { SitesService } from '../sites/sites.service';
import { WooCommerceProductHelper } from './helpers/woocommerce-product.helper';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    private sitesService: SitesService,
  ) {}

  async findAll(): Promise<Product[]> {
    this.logger.log('Finding all products');
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
    this.logger.log(`Finding products with pagination: page=${page}, limit=${limit}, search=${search}, siteId=${siteId}`);

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.site', 'site');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere('(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` });
    }

    // Apply site filter if provided
    if (siteId) {
      queryBuilder.andWhere('product.site.id = :siteId', { siteId });
    }

    // Apply featured filter if provided
    if (featured !== undefined) {
      queryBuilder.andWhere('product.featured = :featured', { featured });
    }

    // Apply sorting
    switch (sortBy) {
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
        queryBuilder.orderBy('product.id', 'DESC');
    }

    // Calculate pagination
    const totalItems = await queryBuilder.getCount();
    const totalPages = Math.ceil(totalItems / limit);

    // Apply pagination
    queryBuilder.skip((page - 1) * limit).take(limit);

    // Execute the query
    const products = await queryBuilder.getMany();

    return { products, totalItems, totalPages };
  }

  async findOne(id: number): Promise<Product> {
    this.logger.log(`Finding product with id: ${id}`);
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['site'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log('Creating a new product');

    // Validate site if siteId is provided
    if (createProductDto.siteId) {
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

      createProductDto.site = site;

      try {
        // Create product on WooCommerce
        const wcProduct = await WooCommerceProductHelper.createProduct(site, createProductDto);

        // Create product in our database with WooCommerce ID
        const product = this.productRepository.create({
          ...createProductDto,
          wc_product_id: wcProduct.id,
          site: site,
        });

        await this.productRepository.save(product);
        return product;
      } catch (error) {
        this.logger.error(`Error creating product: ${error.message}`);
        throw new BadRequestException(`Failed to create product on WooCommerce: ${error.message}`);
      }
    } else {
      throw new BadRequestException('Site ID is required for creating a product');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`Updating product with id: ${id}`);

    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if updating the site
    if (updateProductDto.siteId && updateProductDto.siteId !== product.site.id) {
      const newSite = await this.siteRepository.findOne({
        where: { id: updateProductDto.siteId },
      });

      if (!newSite) {
        throw new NotFoundException(`Site with ID ${updateProductDto.siteId} not found`);
      }

      // Check if new site has WooCommerce enabled
      if (!newSite.has_woocommerce) {
        throw new BadRequestException(`Site with ID ${updateProductDto.siteId} does not have WooCommerce enabled`);
      }

      updateProductDto.site = newSite;
    } else {
      updateProductDto.site = product.site;
    }

    try {
      // Update product on WooCommerce if it exists there
      if (product.wc_product_id) {
        await WooCommerceProductHelper.updateProduct(
          updateProductDto.site,
          product.wc_product_id,
          updateProductDto,
        );
      }

      // Update product in our database
      this.productRepository.merge(product, updateProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(`Error updating product: ${error.message}`);
      throw new BadRequestException(`Failed to update product on WooCommerce: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing product with id: ${id}`);

    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    try {
      // Delete product from WooCommerce if it exists there
      if (product.wc_product_id) {
        await WooCommerceProductHelper.deleteProduct(product.site, product.wc_product_id);
      }

      // Delete product from our database
      await this.productRepository.remove(product);
    } catch (error) {
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
      // Get all products from WooCommerce
      const wcProducts = await WooCommerceProductHelper.syncProductsFromWooCommerce(site);
      this.logger.debug(`Fetched ${wcProducts.length} products from WooCommerce`);

      let added = 0;
      let updated = 0;
      let failed = 0;

      // Process each product
      for (const wcProduct of wcProducts) {
        try {
          // Check if product already exists in our database
          const existingProduct = await this.productRepository.findOne({
            where: {
              wc_product_id: wcProduct.id,
              site: { id: siteId },
            },
          });

          const productData = WooCommerceProductHelper.convertWooCommerceProduct(wcProduct, site);

          if (existingProduct) {
            // Update existing product
            this.productRepository.merge(existingProduct, productData);
            await this.productRepository.save(existingProduct);
            updated++;
          } else {
            // Create new product
            const newProduct = this.productRepository.create(productData);
            await this.productRepository.save(newProduct);
            added++;
          }
        } catch (error) {
          this.logger.error(`Error processing product ${wcProduct.id}: ${error.message}`);
          failed++;
        }
      }

      // Update last sync date for the site
      site.last_sync_date = new Date();
      await this.siteRepository.save(site);

      return { added, updated, failed };
    } catch (error) {
      this.logger.error(`Error syncing products from WooCommerce: ${error.message}`);
      throw new BadRequestException(`Failed to sync products from WooCommerce: ${error.message}`);
    }
  }
}
