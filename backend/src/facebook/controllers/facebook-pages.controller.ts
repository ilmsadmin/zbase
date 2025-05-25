import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FacebookPagesService } from '../services/facebook-pages.service';
import {
  FacebookPageDto,
  ConnectPageDto,
  UpdatePageDto,
  PageQueryDto,
  DisconnectPageDto,
} from '../dto/facebook-page.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/permissions.decorator';

@ApiTags('Facebook Pages')
@ApiBearerAuth()
@Controller('facebook/pages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FacebookPagesController {
  constructor(private readonly facebookPagesService: FacebookPagesService) {}

  @Post('connect')
  @RequirePermissions('facebook.pages.create')
  @ApiOperation({ summary: 'Connect a Facebook page' })
  @ApiResponse({ status: 201, description: 'Page connected successfully', type: FacebookPageDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async connectPage(@Body() connectPageDto: ConnectPageDto, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.connectPage(userId, connectPageDto);
  }

  @Get()
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Get all connected Facebook pages for current user' })
  @ApiResponse({ status: 200, description: 'Pages retrieved successfully', type: [FacebookPageDto] })  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserPages(@Query() query: PageQueryDto, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.getUserPages(userId);
  }

  @Get('available')
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Get available Facebook pages from Facebook API' })
  @ApiResponse({ status: 200, description: 'Available pages retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAvailablePages(@Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.getAvailablePages(userId);
  }

  @Get(':pageId')
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Get a specific Facebook page by ID' })
  @ApiResponse({ status: 200, description: 'Page retrieved successfully', type: FacebookPageDto })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.findUserPage(userId, pageId);
  }

  @Patch(':pageId')
  @RequirePermissions('facebook.pages.update')
  @ApiOperation({ summary: 'Update a Facebook page' })
  @ApiResponse({ status: 200, description: 'Page updated successfully', type: FacebookPageDto })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updatePage(
    @Param('pageId') pageId: string,
    @Body() updatePageDto: UpdatePageDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.facebookPagesService.updatePage(userId, pageId, updatePageDto);
  }

  @Post(':pageId/sync')
  @RequirePermissions('facebook.pages.update')
  @ApiOperation({ summary: 'Sync a Facebook page data' })
  @ApiResponse({ status: 200, description: 'Page synced successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async syncPage(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.syncPage(userId, pageId);
  }

  @Delete(':pageId')
  @RequirePermissions('facebook.pages.delete')
  @ApiOperation({ summary: 'Disconnect a Facebook page' })
  @ApiResponse({ status: 200, description: 'Page disconnected successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async disconnectPage(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.disconnectPage(userId, pageId);
  }
  @Get(':pageId/stats')
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Get Facebook page statistics' })
  @ApiResponse({ status: 200, description: 'Page stats retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPageStats(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.getPageStats(pageId);
  }
  @Get(':pageId/insights')
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Get Facebook page insights' })
  @ApiResponse({ status: 200, description: 'Page insights retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPageInsights(
    @Param('pageId') pageId: string,
    @Request() req,
    @Query('metric') metric?: string,
    @Query('period') period?: string,
  ) {
    const userId = req.user.id;
    
    // Validate period parameter
    const validPeriods = ['day', 'week', 'days_28'] as const;
    const validatedPeriod = period && validPeriods.includes(period as any) 
      ? (period as 'day' | 'week' | 'days_28') 
      : undefined;
    
    return this.facebookPagesService.getPageInsights(pageId, userId, metric, validatedPeriod);
  }

  @Post(':pageId/refresh-token')
  @RequirePermissions('facebook.pages.update')
  @ApiOperation({ summary: 'Refresh Facebook page access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async refreshPageToken(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.refreshPageToken(userId, pageId);
  }

  @Get(':pageId/health')
  @RequirePermissions('facebook.pages.read')
  @ApiOperation({ summary: 'Check Facebook page connection health' })
  @ApiResponse({ status: 200, description: 'Page health checked successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async checkPageHealth(@Param('pageId') pageId: string, @Request() req) {
    const userId = req.user.id;
    return this.facebookPagesService.checkPageHealth(userId, pageId);
  }
}