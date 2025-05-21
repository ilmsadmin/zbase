import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { LogsService } from './logs.service';
import { InventoryLogsService } from './inventory-logs.service';
import { AnalyticsService } from './analytics.service';
import { ReportsService } from './reports.service';
// import { LogsController } from './logs.controller';
import { Log, LogSchema } from './schemas/log.schema';
import { InventoryLog, InventoryLogSchema } from './schemas/inventory-log.schema';
import { SalesAnalytics, SalesAnalyticsSchema } from './schemas/sales-analytics.schema';
import { AnalyticsReport, AnalyticsReportSchema } from './schemas/analytics-report.schema';
import { ForecastingModel, ForecastingModelSchema } from './schemas/forecasting-model.schema';
import { Report, ReportSchema } from './schemas/report.schema';
import { ReportTemplate, ReportTemplateSchema } from './schemas/report-template.schema';

@Module({  imports: [    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('app.mongoUri'),
        dbName: 'zbase'
      }),
    }),    MongooseModule.forFeature([
      { name: Log.name, schema: LogSchema },
      { name: InventoryLog.name, schema: InventoryLogSchema },
      { name: SalesAnalytics.name, schema: SalesAnalyticsSchema },
      { name: AnalyticsReport.name, schema: AnalyticsReportSchema },
      { name: ForecastingModel.name, schema: ForecastingModelSchema },
      { name: Report.name, schema: ReportSchema },
      { name: ReportTemplate.name, schema: ReportTemplateSchema },
    ]),
  ],  // controllers: [LogsController], // Tạm thời vô hiệu hóa LogsController
  providers: [LogsService, InventoryLogsService, AnalyticsService, ReportsService],
  exports: [LogsService, InventoryLogsService, AnalyticsService, ReportsService],
})
export class MongoModule {}
