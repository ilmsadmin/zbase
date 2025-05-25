import {
  Controller,
  Get,
  Query,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { FacebookAuthService } from '../services/facebook-auth.service';
import { FacebookSyncService, SyncEntityType } from '../services/facebook-sync.service';
import { FacebookPagesService } from '../services/facebook-pages.service';

@ApiTags('Facebook OAuth Callback')
@Controller('facebook/oauth')
export class FacebookOAuthCallbackController {
  private readonly logger = new Logger(FacebookOAuthCallbackController.name);
  
  constructor(
    private readonly facebookAuthService: FacebookAuthService,
    private readonly configService: ConfigService,
    private readonly facebookSyncService: FacebookSyncService,
    private readonly facebookPagesService: FacebookPagesService,
  ) {}

  /**
   * Handle Facebook OAuth callback (GET redirect from Facebook)
   * This endpoint has no guards as it's called directly by Facebook
   */
  @Get('callback')
  @ApiOperation({ summary: 'Handle Facebook OAuth callback (GET)' })
  @ApiResponse({ status: 200, description: 'HTML response with JavaScript to communicate with parent window' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleCallbackGet(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Query('error_description') errorDescription: string,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    
    try {
      // Handle OAuth error
      if (error) {
        const errorMessage = errorDescription || error;
        this.logger.error('Facebook OAuth error:', errorMessage);
        return `
          <html>
            <head><title>Facebook Connection Failed</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_ERROR',
                    error: '${errorMessage}'
                  }, '${frontendUrl}');
                  window.close();
                } else {
                  document.body.innerHTML = '<h1>Facebook Connection Failed</h1><p>${errorMessage}</p><p>You can close this window.</p>';
                }
              </script>
            </body>
          </html>
        `;
      }

      // Validate required parameters
      if (!code || !state) {
        const errorMsg = 'Missing required parameters: code or state';
        this.logger.error(errorMsg);
        return `
          <html>
            <head><title>Facebook Connection Failed</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_ERROR',
                    error: '${errorMsg}'
                  }, '${frontendUrl}');
                  window.close();
                } else {
                  document.body.innerHTML = '<h1>Facebook Connection Failed</h1><p>${errorMsg}</p><p>You can close this window.</p>';
                }
              </script>
            </body>
          </html>
        `;
      }

      // Decode userId from state parameter
      const userId = parseInt(state, 10);
      if (isNaN(userId)) {
        const errorMsg = 'Invalid state parameter';
        this.logger.error(errorMsg);
        return `
          <html>
            <head><title>Facebook Connection Failed</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({
                    type: 'FACEBOOK_AUTH_ERROR',
                    error: '${errorMsg}'
                  }, '${frontendUrl}');
                  window.close();
                } else {
                  document.body.innerHTML = '<h1>Facebook Connection Failed</h1><p>${errorMsg}</p><p>You can close this window.</p>';
                }
              </script>
            </body>
          </html>
        `;
      }

      this.logger.log(`Processing Facebook callback for user ${userId} with code: ${code.substring(0, 10)}...`);      // Process the callback
      const result = await this.facebookAuthService.handleCallback(userId, code, state);

      this.logger.log(`Facebook callback successful for user ${userId}`);

      // Trigger synchronization of Facebook data
      try {
        // First, get available pages from Facebook
        const availablePages = await this.facebookPagesService.getAvailablePages(userId);
        
        // Connect each page automatically
        for (const page of availablePages) {
          try {            const connectedPage = await this.facebookPagesService.connectPage(userId, {
              facebookPageId: page.id,
              name: page.name,
              settings: {
                autoReply: false,
                notifications: true,
                moderateComments: false
              }
            });
            
            // Sync page data
            await this.facebookPagesService.syncPage(userId, connectedPage.id);
            
            this.logger.log(`Automatically connected and synced page: ${page.name} (${page.id})`);
          } catch (pageError) {
            this.logger.error(`Error connecting page ${page.id}: ${pageError.message}`);
          }
        }
        
        // Start comprehensive data sync for the user
        this.facebookSyncService.syncUserData({
          userId,
          facebookUserId: result.facebookUser.id,
          entityTypes: [SyncEntityType.ALL],
          forceRefresh: true
        }).catch(syncError => {
          this.logger.error(`Error during Facebook data sync: ${syncError.message}`);
        });
        
        this.logger.log(`Started Facebook data synchronization for user ${userId}`);
      } catch (syncError) {
        this.logger.error(`Error initiating Facebook data sync: ${syncError.message}`);
        // Continue with the authentication flow even if sync fails
      }

      // Return success page that communicates with parent window
      return `
        <html>
          <head><title>Facebook Connection Successful</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'FACEBOOK_AUTH_SUCCESS',
                  data: ${JSON.stringify(result)}
                }, '${frontendUrl}');
                window.close();
              } else {
                document.body.innerHTML = '<h1>Facebook Connected Successfully</h1><p>Your Facebook account has been connected successfully.</p><p>You can close this window.</p>';
              }
            </script>
          </body>
        </html>
      `;
    } catch (error) {
      this.logger.error('Facebook callback error:', error.message);
      
      // Return error page that communicates with parent window
      return `
        <html>
          <head><title>Facebook Connection Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'FACEBOOK_AUTH_ERROR',
                  error: '${error.message || 'Failed to connect Facebook account'}'
                }, '${frontendUrl}');
                window.close();
              } else {
                document.body.innerHTML = '<h1>Facebook Connection Failed</h1><p>${error.message || 'Failed to connect Facebook account'}</p><p>You can close this window.</p>';
              }
            </script>
          </body>
        </html>
      `;
    }
  }
}
