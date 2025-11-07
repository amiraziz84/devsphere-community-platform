import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({example: 'my first post', description: 'post title'})
    @IsString()
    title: string;
    @ApiProperty({example: 'this is my post content', description: 'post content'})
    @IsString()
    content: string;
    @ApiProperty({example: 'https://example.com/banner.jpg', required: false})
    @IsString()
    bannerUrl?: string;
    @ApiProperty({example: ['tech', 'nestjs'], description: 'tags list'})
    @IsArray()
    @IsOptional()
    tags?: string[];
}
