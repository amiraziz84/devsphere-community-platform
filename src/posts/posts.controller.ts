import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  // create post 
  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId,dto);
  }
  // Get all posts (pagination + filter)
  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('tag') tag?: string,
  ) {
    return this.postsService.findAll(Number(page), Number(limit), tag);
  }
  // Get single post
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  // updata post
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser('userId') userId: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id,userId, dto);
  }
  // delete post
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: Role) {
    const isAdmin = role == 'ADMIN';
    return this.postsService.remove(id, userId, isAdmin);
  }
}
