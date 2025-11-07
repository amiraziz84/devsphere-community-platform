import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PrismaService, JwtAuthGuard],
})
export class PostsModule {}
