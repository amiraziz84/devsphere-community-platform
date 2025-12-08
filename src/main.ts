import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { Logger } from 'nestjs-pino';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // Redis
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redisClient = new Redis(redisUrl);
    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }

  // ⭐ FINAL CORS FIX ⭐
  const allowedOrigins = [
    'https://super-gelato-a9840f.netlify.app', // your Netlify frontend
    'http://localhost:5173',                   // local dev
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  // Static Uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Community Platform API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Running on port ${port}`);
}

bootstrap();
