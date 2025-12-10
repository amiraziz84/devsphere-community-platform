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

  // ===== Redis connection =====
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redisClient = new Redis(redisUrl);
    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('Redis error:', err));
  }

  // ===== CORS setup (FINAL CLEAN VERSION) =====
  const allowedOrigins = [
    'http://localhost:5173',
    'https://dev-sphere-frontend-system.vercel.app', // Main Production Frontend
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  console.log("🟢 Allowed CORS origins:");
  allowedOrigins.forEach((o) => console.log(" - " + o));

  // ===== Static uploads =====
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  // ===== Swagger setup =====
  const config = new DocumentBuilder()
    .setTitle('Community Platform API')
    .setDescription('API docs for Auth, Posts, Comments, Notifications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ===== Start server =====
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
