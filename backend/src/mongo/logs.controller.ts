import { Controller, Get, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { LogsService, LogQueryOptions } from './logs.service';
import { LogActionType, LogResourceType } from './schemas/log.schema';

@Controller('logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @RequirePermissions('read:logs')
  async findLogs(
    @Query('userId') userId?: string,
    @Query('action') action?: string | string[],
    @Query('resourceType') resourceType?: string | string[],
    @Query('resourceId') resourceId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const options: LogQueryOptions = {};
    
    if (userId) {
      options.userId = parseInt(userId, 10);
    }
    
    if (action) {
      options.action = action;
    }
    
    if (resourceType) {
      options.resourceType = resourceType;
    }
    
    if (resourceId) {
      options.resourceId = resourceId;
    }
    
    if (startDate) {
      options.startDate = new Date(startDate);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate);
    }
    
    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    
    if (skip) {
      options.skip = parseInt(skip, 10);
    }
    
    return this.logsService.findLogs(options);
  }

  @Get('inventory')
  @RequirePermissions('read:logs')
  async findInventoryLogs(
    @Query('warehouseId') warehouseId?: string,
    @Query('productId') productId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const options: Omit<LogQueryOptions, 'resourceType' | 'action'> = {};
    
    if (startDate) {
      options.startDate = new Date(startDate);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate);
    }
    
    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    
    if (skip) {
      options.skip = parseInt(skip, 10);
    }
    
    return this.logsService.findInventoryLogs(warehouseId, productId, options);
  }

  @Get('sales')
  @RequirePermissions('read:logs')
  async findSalesLogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const options: Omit<LogQueryOptions, 'action'> = {};
    
    if (startDate) {
      options.startDate = new Date(startDate);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate);
    }
    
    if (userId) {
      options.userId = parseInt(userId, 10);
    }
    
    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    
    if (skip) {
      options.skip = parseInt(skip, 10);
    }
    
    return this.logsService.findSalesLogs(options);
  }

  @Get('warranty')
  @RequirePermissions('read:logs')
  async findWarrantyLogs(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const options: Omit<LogQueryOptions, 'resourceType'> = {};
    
    if (startDate) {
      options.startDate = new Date(startDate);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate);
    }
    
    if (userId) {
      options.userId = parseInt(userId, 10);
    }
    
    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    
    if (skip) {
      options.skip = parseInt(skip, 10);
    }
    
    return this.logsService.findWarrantyLogs(options);
  }

  @Get('user-activity')
  @RequirePermissions('read:logs')
  async findUserActivity(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const options: Omit<LogQueryOptions, 'userId'> = {};
    
    if (startDate) {
      options.startDate = new Date(startDate);
    }
    
    if (endDate) {
      options.endDate = new Date(endDate);
    }
    
    if (limit) {
      options.limit = parseInt(limit, 10);
    }
    
    if (skip) {
      options.skip = parseInt(skip, 10);
    }
    
    return this.logsService.findLogsByUserId(userId, options);
  }
}
