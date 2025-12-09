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

  // ===== UPDATED CORS FOR RAILWAY + VERCEL =====
  app.enableCors({
    origin: [
      'http://localhost:5173',

      // ⭐ Add your Vercel Preview domain
      'https://dev-sphere-frontend-system-git-main-web-s-projects-1a9a631a.vercel.app/',

      // ⭐ Add your final stable Vercel domain (if exists)
      'https://dev-sphere-frontend.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  console.log("🟢 Allowed CORS origins:");
  console.log("http://localhost:5173");
  console.log("https://dev-sphere-frontend-system-m4k1r12zt-web-s-projects-1a9a631a.vercel.app");
  console.log("https://dev-sphere-frontend.vercel.app");

  // ===== Static Uploads =====
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // ===== Swagger Setup =====
  const config = new DocumentBuilder()
    .setTitle('Community Platform API')
    .setDescription('API docs for Auth, Posts, Comments, Notifications')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ===== Start Server =====
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();
