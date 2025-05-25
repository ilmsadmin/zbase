import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// Services
import { FacebookService } from './facebook.service';
import { FacebookAuthService } from './services/facebook-auth.service';
import { FacebookGraphService } from './services/facebook-graph.service';
import { FacebookPagesService } from './services/facebook-pages.service';
import { FacebookMessagesService } from './services/facebook-messages.service';
import { FacebookCommentsService } from './services/facebook-comments.service';
import { FacebookAnalyticsService } from './services/facebook-analytics.service';
import { FacebookSyncService } from './services/facebook-sync.service';

// Controllers
import { FacebookController } from './facebook.controller';
import { FacebookAuthController } from './controllers/facebook-auth.controller';
import { FacebookOAuthCallbackController } from './controllers/facebook-oauth-callback.controller';
import { FacebookConfigController } from './controllers/facebook-config.controller';
import { FacebookPagesController } from './controllers/facebook-pages.controller';
import { FacebookMessagesController } from './controllers/facebook-messages.controller';
import { FacebookCommentsController } from './controllers/facebook-comments.controller';
import { FacebookAnalyticsController } from './controllers/facebook-analytics.controller';
import { FacebookActivityLogsController } from './controllers/facebook-activity-logs.controller';

// Strategies
import { FacebookStrategy } from './strategies/facebook.strategy';

// Other modules
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MongoModule,
    PassportModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: 10000,
        maxRedirects: 5,
        headers: {
          'User-Agent': 'ZBase-Facebook-Integration/1.0',
        },
      }),
    }),
    ConfigModule,
  ],  controllers: [
    FacebookController,
    FacebookAuthController,
    FacebookOAuthCallbackController,
    FacebookConfigController,
    FacebookPagesController,
    FacebookMessagesController,
    FacebookCommentsController,
    FacebookAnalyticsController,
    FacebookActivityLogsController,
  ],  providers: [
    FacebookService,
    FacebookAuthService,
    FacebookGraphService,
    FacebookPagesService,
    FacebookMessagesService,
    FacebookCommentsService,
    FacebookAnalyticsService,
    FacebookSyncService,
    FacebookStrategy,
  ],  exports: [
    FacebookService,
    FacebookAuthService,
    FacebookGraphService,
    FacebookPagesService,
    FacebookMessagesService,
    FacebookCommentsService,
    FacebookAnalyticsService,
    FacebookSyncService,
  ],
})
export class FacebookModule {}
