import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';

async function bootstrap() {
  // Create app with Pino logger
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  // Serve uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Community Platform API')
    .setDescription('API documentation for Auth, Posts, Comments, and Notifications.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  const logger = app.get(Logger);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📘 Swagger Docs: http://localhost:${port}/api`);
}
bootstrap();
