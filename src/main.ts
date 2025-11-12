import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { io } from 'socket.io-client';

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

  const socket = io('http://localhost:3000/notifications', {
  query: { token: 'Bearer-less-JWT' } // or { token: '<JWT>' }
});
// When server emits 'newNotification', you'll receive it:
socket.on('newNotification', data => {
  console.log('New notification:', data);
});



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
