import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('facebook/config')
export class FacebookConfigController {
  constructor(private configService: ConfigService) {}

  @Get('check')
  async checkConfiguration() {
    const appId = this.configService.get('FACEBOOK_APP_ID');
    const appSecret = this.configService.get('FACEBOOK_APP_SECRET');    const apiVersion = this.configService.get('FACEBOOK_GRAPH_API_VERSION');
    const callbackUrl = this.configService.get('FACEBOOK_CALLBACK_URL');

    const issues: string[] = [];
    
    if (!appId) {
      issues.push('FACEBOOK_APP_ID is not configured');
    }
    
    if (!appSecret) {
      issues.push('FACEBOOK_APP_SECRET is not configured');
    }
    
    if (!callbackUrl) {
      issues.push('FACEBOOK_CALLBACK_URL is not configured');
    }

    // Test Facebook Graph API connectivity
    let apiConnectivity = false;
    try {
      const response = await fetch(`https://graph.facebook.com/${apiVersion || 'v22.0'}/me?access_token=invalid`);
      // We expect a 400 error with invalid token, but 200 means the API is reachable
      apiConnectivity = response.status === 400;
    } catch (error) {
      issues.push('Cannot reach Facebook Graph API');
    }

    return {
      status: issues.length === 0 ? 'success' : 'error',
      configured: {
        appId: !!appId,
        appSecret: !!appSecret,
        apiVersion: apiVersion || 'v22.0',
        callbackUrl: !!callbackUrl,
        apiConnectivity
      },
      issues,
      endpoints: {
        callback: callbackUrl,
        webhook: `${this.configService.get('APP_HOST', 'http://localhost:3001')}/api/facebook/webhooks`
      }
    };
  }

  @Get('urls')
  async getUrls() {
    const baseUrl = this.configService.get('FACEBOOK_CALLBACK_URL', 'http://localhost:3001/api');
    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    
    return {
      oauthRedirectUrls: [
        `${baseUrl}/facebook/auth/callback`,
        `${frontendUrl}/auth/facebook/callback`
      ],
      validOrigins: [
        frontendUrl,
        baseUrl.replace('/api', '')
      ],
      webhookUrl: `${baseUrl}/facebook/webhooks`
    };
  }
}
