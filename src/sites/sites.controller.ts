import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, UseFilters, Logger, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { Site } from '../entities/site.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { SiteConnectionResponseDto } from './dto/site-connection-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SitesExceptionFilter } from './filters/sites-exception.filter';

@ApiTags('Sites')
@ApiBearerAuth()
@Controller('sites')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseFilters(SitesExceptionFilter)
export class SitesController {
  private readonly logger = new Logger(SitesController.name);
  
  constructor(private readonly sitesService: SitesService) {}  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all sites' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of all connected sites',
    type: [SiteResponseDto]
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = 'id',
    @Query('status') status: string = '',
    @Query('has_woocommerce') hasWoocommerce?: boolean,
  ) {
    this.logger.log('Getting all sites with pagination');
    const { sites, totalItems, totalPages } = await this.sitesService.findAllWithPagination(
      page, 
      limit, 
      search,
      sortBy,
      status,
      hasWoocommerce
    );
    
    return {
      items: sites.map(site => SiteResponseDto.fromEntity(site)),
      meta: {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      }
    };
  }@Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get site by ID' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The site with the given ID',
    type: SiteResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Site not found'
  })
  async findOne(@Param('id') id: string): Promise<SiteResponseDto> {
    this.logger.log(`Getting site with ID: ${id}`);
    const site = await this.sitesService.findOne(+id);
    return SiteResponseDto.fromEntity(site);
  }  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new site' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Site created successfully',
    type: SiteResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid site data or connection failed'
  })
  async create(@Body() createSiteDto: CreateSiteDto): Promise<SiteResponseDto> {
    this.logger.log(`Creating new site: ${createSiteDto.name}`);
    const site = await this.sitesService.create(createSiteDto);
    return SiteResponseDto.fromEntity(site);
  }  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update site by ID' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Site updated successfully',
    type: SiteResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Site not found'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid update data'
  })
  async update(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto): Promise<SiteResponseDto> {
    this.logger.log(`Updating site with ID: ${id}`);
    const site = await this.sitesService.update(+id, updateSiteDto);
    return SiteResponseDto.fromEntity(site);
  }  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete site by ID' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Site deleted successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Site not found'
  })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting site with ID: ${id}`);
    return this.sitesService.remove(+id);
  }
  @Post(':id/test-connection')
  @Roles('admin')
  @ApiOperation({ summary: 'Test connection to an existing site' })
  @ApiParam({ name: 'id', description: 'Site ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Connection test successful',
    type: SiteConnectionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Site not found'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Connection test failed'
  })  async testConnection(@Param('id') id: string): Promise<SiteConnectionResponseDto> {
    this.logger.log(`Testing connection for site with ID: ${id}`);
    const site = await this.sitesService.findOne(+id);
    await this.sitesService.testConnection(site);    this.logger.log(`Connection successful for site: ${site.name}`);
    
    // Get the connection result to include version information
    const connectionResult = this.sitesService.getLastConnectionResult();
    
    return new SiteConnectionResponseDto({
      success: true,
      message: 'Connection test successful',
      site: SiteResponseDto.fromEntity(site),
      version: connectionResult.version,
      details: connectionResult.info
    });
  }
    @Post('connect')
  @Roles('admin')
  @ApiOperation({ summary: 'Connect to a new site and save it' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Site connected and saved successfully',
    type: SiteConnectionResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Connection test failed or invalid site data'
  })
  async connect(@Body() createSiteDto: CreateSiteDto): Promise<SiteConnectionResponseDto> {
    this.logger.log(`Connecting to site: ${createSiteDto.name} (${createSiteDto.wp_url})`);
    // First test the connection, then create the site
    await this.sitesService.testConnection(createSiteDto);
    const site = await this.sitesService.create(createSiteDto);
    this.logger.log(`Successfully connected to site: ${site.name} with ID: ${site.id}`);
    return new SiteConnectionResponseDto({
      success: true,
      message: 'Site successfully connected and saved',
      site: SiteResponseDto.fromEntity(site)
    });
  }

  @Get(':id/statistics') 
  async getSiteStatistics(@Param('id') id: number) {
    const stats = await this.sitesService.getSiteStatistics(id);
    return stats;
  }
}
