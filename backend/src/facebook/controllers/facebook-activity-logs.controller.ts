import {
  Controller,
  Get,
  Query,
  Param,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

// Interfaces
interface UserDetail {
  id: number;
  name: string;
  email: string;
}

@ApiTags('Facebook Activity Logs')
@ApiBearerAuth()
@Controller('facebook/activity-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FacebookActivityLogsController {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get Facebook activity logs with filtering options
   */
  @Get()
  @RequirePermissions('facebook.activity.read')
  @ApiOperation({ summary: 'Get Facebook activity logs' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getActivityLogs(
    @Request() req: any,
    @Query('pageId') pageId?: string,
    @Query('facebookUserId') facebookUserId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const userId = req.user.id;
      
      // Build filter conditions
      const where: any = {};
      
      if (pageId) {
        where.pageId = pageId;
      }
      
      if (facebookUserId) {
        where.facebookUserId = facebookUserId;
      }
      
      if (action) {
        where.action = action;
      }
      
      if (entityType) {
        where.entityType = entityType;
      }
      
      // Date filtering
      if (fromDate || toDate) {
        where.createdAt = {};
        
        if (fromDate) {
          where.createdAt.gte = new Date(fromDate);
        }
        
        if (toDate) {
          where.createdAt.lte = new Date(toDate);
        }
      }
      
      // Get total count
      const total = await this.prismaService.facebookActivityLog.count({
        where,
      });
      
      // Get paginated results
      const logs = await this.prismaService.facebookActivityLog.findMany({
        where,
        include: {
          facebookUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          page: {
            select: {
              id: true,
              name: true,
              category: true,
            },
          },
          systemUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit ? parseInt(limit) : 100,
        skip: offset ? parseInt(offset) : 0,
      });
      
      return {
        success: true,
        data: {
          logs,
          total,
          limit: limit ? parseInt(limit) : 100,
          offset: offset ? parseInt(offset) : 0,
        },
        message: 'Activity logs retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve activity logs',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get activity log details by ID
   */
  @Get(':id')
  @RequirePermissions('facebook.activity.read')
  @ApiOperation({ summary: 'Get activity log details by ID' })
  @ApiResponse({ status: 200, description: 'Activity log retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Activity log not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getActivityLogById(@Request() req: any, @Param('id') id: string) {
    try {
      const userId = req.user.id;
      const logId = parseInt(id);
      
      if (isNaN(logId)) {
        throw new HttpException('Invalid activity log ID', HttpStatus.BAD_REQUEST);
      }
      
      const log = await this.prismaService.facebookActivityLog.findUnique({
        where: { id: logId },
        include: {
          facebookUser: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
            },
          },
          page: {
            select: {
              id: true,
              name: true,
              category: true,
              profilePicture: true,
            },
          },
          systemUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      if (!log) {
        throw new HttpException('Activity log not found', HttpStatus.NOT_FOUND);
      }
      
      return {
        success: true,
        data: log,
        message: 'Activity log retrieved successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve activity log',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get activity log summary
   */
  @Get('summary/stats')
  @RequirePermissions('facebook.activity.read')
  @ApiOperation({ summary: 'Get activity log summary statistics' })
  @ApiResponse({ status: 200, description: 'Activity log summary retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getActivityLogSummary(
    @Request() req: any,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    try {
      const userId = req.user.id;
      
      // Date filtering
      const where: any = {};
      if (fromDate || toDate) {
        where.createdAt = {};
        
        if (fromDate) {
          where.createdAt.gte = new Date(fromDate);
        }
        
        if (toDate) {
          where.createdAt.lte = new Date(toDate);
        }
      }
      
      // Get action types count
      const actionCounts = await this.prismaService.$queryRaw`
        SELECT "action", COUNT(*) as count
        FROM "facebook_activity_logs"
        WHERE ${where.createdAt ? `"createdAt" BETWEEN ${where.createdAt.gte} AND ${where.createdAt.lte}` : '1=1'}
        GROUP BY "action"
        ORDER BY count DESC
      `;
      
      // Get entity types count
      const entityTypeCounts = await this.prismaService.$queryRaw`
        SELECT "entityType", COUNT(*) as count
        FROM "facebook_activity_logs"
        WHERE ${where.createdAt ? `"createdAt" BETWEEN ${where.createdAt.gte} AND ${where.createdAt.lte}` : '1=1'}
        GROUP BY "entityType"
        ORDER BY count DESC
      `;
        // Get most active users
      const activeUsers = await this.prismaService.facebookActivityLog.groupBy({
        by: ['systemUserId'],
        where,
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });
        const userIds = activeUsers.map(item => item.systemUserId).filter(Boolean);
      
      let userDetails: UserDetail[] = [];
      if (userIds.length > 0) {
        userDetails = await this.prismaService.user.findMany({
          where: {
            id: {
              in: userIds as number[],
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
      }
      
      // Map user details to active users
      const activeUsersWithDetails = activeUsers.map(item => {
        const user = userDetails.find(u => u.id === item.systemUserId);
        return {
          userId: item.systemUserId,
          count: item._count.id,
          user: user || null,
        };
      });
      
      return {
        success: true,
        data: {
          actionCounts,
          entityTypeCounts,
          activeUsers: activeUsersWithDetails,
        },
        message: 'Activity log summary retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to retrieve activity log summary',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
