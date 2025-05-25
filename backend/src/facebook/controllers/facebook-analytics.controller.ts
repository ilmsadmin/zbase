import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Param,
  Response,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/permissions.decorator';
import { FacebookAnalyticsService } from '../services/facebook-analytics.service';
import {
  AnalyticsFilterDto,
  ExportAnalyticsDto,
} from '../dto/facebook-analytics.dto';
import { Response as ExpressResponse } from 'express';

@ApiTags('Facebook Analytics')
@ApiBearerAuth()
@Controller('facebook/analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FacebookAnalyticsController {  constructor(
    private readonly facebookAnalyticsService: FacebookAnalyticsService,
  ) {}
  
  /**
   * Get overview analytics for all connected pages
   */
  @Get('overview')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get overview analytics for connected page' })
  @ApiResponse({ status: 200, description: 'Analytics overview retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getOverview(@Request() req: any, @Query() filters: AnalyticsFilterDto) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const overview = await this.facebookAnalyticsService.getOverview(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: overview,
        message: 'Analytics overview retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve analytics overview',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get page-specific analytics
   */
  @Get('pages/:pageId')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get page-specific analytics' })
  @ApiResponse({ status: 200, description: 'Page analytics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getPageAnalytics(
    @Request() req: any,
    @Param('pageId') pageId: string,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      const analytics = await this.facebookAnalyticsService.getPageAnalytics(
        userId,
        pageId,
        filters,
      );

      return {
        success: true,
        data: analytics,
        message: 'Page analytics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve page analytics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get message analytics
   */
  @Get('messages')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get message analytics' })
  @ApiResponse({ status: 200, description: 'Message analytics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getMessageAnalytics(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const analytics = await this.facebookAnalyticsService.getMessageAnalytics(
        filters.pageId,
        new Date(filters.fromDate),
        new Date(filters.toDate),
      );

      return {
        success: true,
        data: analytics,
        message: 'Message analytics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve message analytics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get comment analytics
   */
  @Get('comments')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get comment analytics' })
  @ApiResponse({ status: 200, description: 'Comment analytics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCommentAnalytics(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const analytics = await this.facebookAnalyticsService.getCommentAnalytics(
        filters.pageId,
        new Date(filters.fromDate),
        new Date(filters.toDate),
      );

      return {
        success: true,
        data: analytics,
        message: 'Comment analytics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve comment analytics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get engagement metrics
   */
  @Get('engagement')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get engagement metrics' })
  @ApiResponse({ status: 200, description: 'Engagement metrics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getEngagementMetrics(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }

      const metrics = await this.facebookAnalyticsService.getEngagementMetrics(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: metrics,
        message: 'Engagement metrics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve engagement metrics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get response time analytics
   */
  @Get('response-time')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get response time analytics' })
  @ApiResponse({ status: 200, description: 'Response time analytics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getResponseTimeAnalytics(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
      
      const analytics = await this.facebookAnalyticsService.getResponseTimeAnalytics(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: analytics,
        message: 'Response time analytics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve response time analytics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get top performers (posts, pages, etc.)
   */
  @Get('top-performers')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get top performers (posts, pages, etc.)' })
  @ApiResponse({ status: 200, description: 'Top performers retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getTopPerformers(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
    @Query('type') type?: 'posts' | 'pages' | 'conversations',
    @Query('limit') limit?: string,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
        const performers = await this.facebookAnalyticsService.getTopPerformers(
        userId,
        filters.pageId,
        filters
      );

      return {
        success: true,
        data: performers,
        message: 'Top performers retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve top performers',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get activity trends over time
   */
  @Get('trends')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get activity trends over time' })
  @ApiResponse({ status: 200, description: 'Activity trends retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getActivityTrends(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
    @Query('granularity') granularity?: 'hour' | 'day' | 'week' | 'month',
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
      
      const trends = await this.facebookAnalyticsService.getActivityTrends(
        userId,
        filters.pageId,
        filters,
      );

      return {
        success: true,
        data: trends,
        message: 'Activity trends retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve activity trends',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Export analytics data
   */
  @Post('export')
  @RequirePermissions('facebook.analytics.export')
  @ApiOperation({ summary: 'Export analytics data' })
  @ApiResponse({ status: 200, description: 'Analytics data exported successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async exportAnalytics(
    @Request() req: any,
    @Body() exportDto: ExportAnalyticsDto,
    @Response() res: ExpressResponse,
  ) {
    try {
      const userId = req.user.id;
      
      if (!exportDto.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
        const exportData = await this.facebookAnalyticsService.exportAnalytics(
        userId,
        exportDto.pageId,
        exportDto,
        exportDto.format,
      );

      // Set appropriate headers based on export format
      if (exportDto.format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="facebook-analytics-${Date.now()}.csv"`,
        );
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="facebook-analytics-${Date.now()}.json"`,
        );
      }

      return res.send(exportData);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to export analytics data',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }  /**
   * Get real-time metrics
   */
  @Get('real-time')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get real-time metrics' })
  @ApiResponse({ status: 200, description: 'Real-time metrics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getRealTimeMetrics(@Request() req: any, @Query('pageId') pageId?: string) {
    try {
      const userId = req.user.id;
      
      if (!pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
      
      const metrics = await this.facebookAnalyticsService.getRealTimeMetrics(
        userId,
        pageId
      );

      return {
        success: true,
        data: metrics,
        message: 'Real-time metrics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve real-time metrics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get audience insights
   */
  @Get('audience')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get audience insights' })
  @ApiResponse({ status: 200, description: 'Audience insights retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getAudienceInsights(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
        const insights = await this.facebookAnalyticsService.getAudienceInsights(
        userId,
        filters.pageId,
        filters
      );

      return {
        success: true,
        data: insights,
        message: 'Audience insights retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve audience insights',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Compare performance across different periods
   */
  @Get('compare')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Compare performance across different periods' })
  @ApiResponse({ status: 200, description: 'Performance comparison retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async comparePerformance(
    @Request() req: any,
    @Query('currentPeriod') currentPeriod: string,
    @Query('comparisonPeriod') comparisonPeriod: string,
    @Query() filters: AnalyticsFilterDto,
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }
        const comparison = await this.facebookAnalyticsService.comparePerformance(
        userId,
        filters.pageId,
        {
          ...filters,
          currentPeriod,
          comparisonPeriod
        }
      );

      return {
        success: true,
        data: comparison,
        message: 'Performance comparison retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve performance comparison',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * Get custom metrics based on user configuration
   */
  @Get('custom')
  @RequirePermissions('facebook.analytics.read')
  @ApiOperation({ summary: 'Get custom metrics based on user configuration' })
  @ApiResponse({ status: 200, description: 'Custom metrics retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getCustomMetrics(
    @Request() req: any,
    @Query() filters: AnalyticsFilterDto,
    @Query('metrics') metrics?: string, // comma-separated list
  ) {
    try {
      const userId = req.user.id;
      
      if (!filters.pageId) {
        throw new HttpException('Page ID is required', HttpStatus.BAD_REQUEST);
      }      const metricsList = metrics ? metrics.split(',') : [];
      const customMetrics = await this.facebookAnalyticsService.getCustomMetrics(
        userId,
        filters.pageId,
        filters
      );

      return {
        success: true,
        data: customMetrics,
        message: 'Custom metrics retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve custom metrics',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
