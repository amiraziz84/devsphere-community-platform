// src/posts/dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'My first post', description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is my post content', description: 'Post content' })
  @IsString()
  content: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({ example: ['tech', 'nestjs'], description: 'Tags list', required: false })
  @IsOptional()
  @IsArray()
  tags?: string[] | string;
}
