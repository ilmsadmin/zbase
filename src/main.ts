import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Apply global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  // Use cookie-parser middleware
  app.use(cookieParser());
  
  // Set up EJS view engine
  app.setViewEngine('ejs');
  
  // Determine the correct views directory based on whether we're in production or development
  const viewsPath = join(__dirname, '..', process.env.NODE_ENV === 'production' ? 'src/views' : 'src/views');
  app.setBaseViewsDir(viewsPath);
    // Serve static files - also adjust for production or development
  const staticPath = join(__dirname, '..', process.env.NODE_ENV === 'production' ? 'src/public' : 'src/public');
  app.useStaticAssets(staticPath);
  
  // Enable CORS for development
  app.enableCors();
    // Set up Swagger documentation
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('WordPress Hub API')
      .setDescription('API for managing multiple WordPress and WooCommerce sites')
      .setVersion('1.0')
      .addTag('sites', 'Site management endpoints')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
  
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
  }
  console.log(`Views directory: ${viewsPath}`);
  console.log(`Static assets directory: ${staticPath}`);
}

bootstrap();