import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../permissions/permissions.guard';
import { RequirePermissions } from '../../permissions/permissions.decorator';
import { FacebookAuthService } from '../services/facebook-auth.service';
import { ConnectFacebookDto } from '../dto/facebook-user.dto';

@ApiTags('Facebook Authentication')
@ApiBearerAuth()
@Controller('facebook/auth')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FacebookAuthController {
  private readonly logger = new Logger(FacebookAuthController.name);
  
  constructor(
    private readonly facebookAuthService: FacebookAuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get Facebook OAuth authorization URL
   */
  @Get('connect')
  @RequirePermissions('facebook.users.create')
  @ApiOperation({ summary: 'Get Facebook OAuth authorization URL' })
  @ApiResponse({ status: 200, description: 'Authorization URL generated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAuthUrl(@Request() req: any) {
    try {
      const userId = req.user.id;
      const authUrl = await this.facebookAuthService.getAuthorizationUrl(userId);
      
      return {
        success: true,
        data: { authUrl },
        message: 'Facebook authorization URL generated successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to generate authorization URL',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Handle Facebook OAuth callback (POST method for API calls)
   */
  @Post('callback')
  @RequirePermissions('facebook.users.create')
  @ApiOperation({ summary: 'Handle Facebook OAuth callback' })
  @ApiResponse({ status: 200, description: 'Facebook account connected successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async handleCallback(
    @Request() req: any,
    @Body() connectDto: ConnectFacebookDto,
  ) {
    try {
      const userId = req.user.id;
      const result = await this.facebookAuthService.handleCallback(
        userId,
        connectDto.code,
        connectDto.state,
      );

      return {
        success: true,
        data: result,
        message: 'Facebook account connected successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to connect Facebook account',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Get current Facebook connection status
   */
  @Get('status')
  @RequirePermissions('facebook.users.read')
  @ApiOperation({ summary: 'Get current Facebook connection status' })
  @ApiResponse({ status: 200, description: 'Connection status retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getConnectionStatus(@Request() req: any) {
    try {
      const userId = req.user.id;
      const status = await this.facebookAuthService.getConnectionStatus(userId);

      return {
        success: true,
        data: status,
        message: 'Facebook connection status retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get connection status',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Refresh Facebook access token
   */
  @Post('refresh')
  @RequirePermissions('facebook.users.update')
  @ApiOperation({ summary: 'Refresh Facebook access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async refreshToken(@Request() req: any) {
    try {
      const userId = req.user.id;
      const result = await this.facebookAuthService.refreshToken(userId);

      return {
        success: true,
        data: result,
        message: 'Facebook token refreshed successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to refresh token',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Disconnect Facebook account
   */
  @Post('disconnect')
  @RequirePermissions('facebook.users.delete')
  @ApiOperation({ summary: 'Disconnect Facebook account' })
  @ApiResponse({ status: 200, description: 'Account disconnected successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async disconnect(@Request() req: any) {
    try {
      const userId = req.user.id;
      await this.facebookAuthService.disconnect(userId);

      return {
        success: true,
        message: 'Facebook account disconnected successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to disconnect Facebook account',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Validate Facebook connection
   */
  @Get('validate')
  @RequirePermissions('facebook.users.read')
  @ApiOperation({ summary: 'Validate Facebook connection' })
  @ApiResponse({ status: 200, description: 'Validation completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async validateConnection(@Request() req: any) {
    try {
      const userId = req.user.id;
      const isValid = await this.facebookAuthService.validateConnection(userId);

      return {
        success: true,
        data: { isValid },
        message: 'Facebook connection validation completed',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to validate connection',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
