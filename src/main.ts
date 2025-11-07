import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Community Platform API')
    .setDescription('API documentation for Auth, Posts, Comments, and Notifications.')
    .setVersion('1.0')
    .addBearerAuth() // 👈 JWT token input enable karta hai
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // 👈 Swagger URL: /api



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
