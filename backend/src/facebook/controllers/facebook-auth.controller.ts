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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FacebookAuthService } from '../services/facebook-auth.service';
import { ConnectFacebookDto } from '../dto/facebook-user.dto';

@Controller('facebook/auth')
@UseGuards(JwtAuthGuard)
export class FacebookAuthController {
  constructor(private readonly facebookAuthService: FacebookAuthService) {}

  /**
   * Get Facebook OAuth authorization URL
   */
  @Get('connect')
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
   * Handle Facebook OAuth callback
   */
  @Post('callback')
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
