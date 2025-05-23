import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { DashboardController } from './dashboard.controller';
import { ReportsService } from './reports.service';
import { MongoModule } from '../mongo/mongo.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthModule } from '../auth/auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongoModule,
    AuthModule,
    PermissionsModule,
    PrismaModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwtSecret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwtExpiresIn', '1d'),
        },
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/reports',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [ReportsController, DashboardController],
  providers: [ReportsService],
  exports: [ReportsService]
})
export class ReportsModule {}
