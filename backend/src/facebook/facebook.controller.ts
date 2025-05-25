import { Controller, Get, Post, Delete, UseGuards, Req, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FacebookService } from './facebook.service';
import { getUserIdFromRequest } from '../common/utils/auth.utils';

@ApiTags('Facebook')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('facebook')
export class FacebookController {
  constructor(private readonly facebookService: FacebookService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get Facebook connection status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Facebook connection status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isConnected: { type: 'boolean' },
        facebookUser: { 
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            profilePicture: { type: 'string' },
            connectedAt: { type: 'string', format: 'date-time' },
            lastSyncAt: { type: 'string', format: 'date-time' },
            scopes: { type: 'array', items: { type: 'string' } },
          },
        },
        connectedPages: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              profilePicture: { type: 'string' },
              connectedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        totalPages: { type: 'number' },
      },
    },
  })  async getConnectionStatus(@Req() req: Request) {
    const userId = getUserIdFromRequest(req);
    return this.facebookService.getConnectionStatus(userId);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get Facebook integration overview statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Overview statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        isConnected: { type: 'boolean' },
        stats: {
          type: 'object',
          nullable: true,
          properties: {
            pages: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                connected: { type: 'number' },
              },
            },
            messages: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                unread: { type: 'number' },
              },
            },
            comments: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                pending: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })  async getOverview(@Req() req: Request) {
    const userId = getUserIdFromRequest(req);
    return this.facebookService.getOverviewStats(userId);
  }

  @Delete('disconnect')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disconnect Facebook account' })
  @ApiResponse({ 
    status: 200, 
    description: 'Facebook account disconnected successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Facebook account not connected' })  async disconnectAccount(@Req() req: Request) {
    const userId = getUserIdFromRequest(req);
    return this.facebookService.disconnectAccount(userId);
  }
}
