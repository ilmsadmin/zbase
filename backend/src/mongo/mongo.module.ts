import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { LogsService } from './logs.service';
// import { LogsController } from './logs.controller';
import { Log, LogSchema } from './schemas/log.schema';

@Module({
  imports: [    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('app.mongoUri'),
        dbName: 'zbase'
      }),
    }),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  // controllers: [LogsController], // Tạm thời vô hiệu hóa LogsController
  providers: [LogsService],
  exports: [LogsService],
})
export class MongoModule {}
