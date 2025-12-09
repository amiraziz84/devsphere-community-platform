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

  // ===== Redis Connection =====
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const redisClient = new Redis(redisUrl);

    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  } else {
    console.log('⚠️ No REDIS_URL provided — skipping Redis connection');
  }

  // ===== CORS for Local + Preview + Production =====
  const allowedOrigins = [
    'http://localhost:5173',     // Local frontend

    // ⭐ Vercel Preview Deployment (Your preview link)
    'https://dev-sphere-frontend-system-git-main-web-s-projects-1a9a631a.vercel.app',

    // ⭐ Vercel Production Domain (Main domain)
    'https://dev-sphere-frontend-system.vercel.app',
  ];

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow mobile/ThunderClient/Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log('❌ Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  console.log('\n🟢 Allowed CORS Origins:');
  allowedOrigins.forEach((o) => console.log(' → ', o));

  // ===== Static Uploads =====
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // ===== Swagger API Docs =====
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

  console.log(`\n🚀 Server running on port ${port}\n`);
}

bootstrap();
