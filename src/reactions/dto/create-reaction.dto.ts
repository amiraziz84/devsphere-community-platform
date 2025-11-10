import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ReactionType {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
}

export class CreateReactionDto {
  @ApiProperty({ example: 'LIKE', enum: ReactionType })
  @IsEnum(ReactionType)
  type: ReactionType;

  @ApiProperty({ example: 'POST_ID_HERE', required: false })
  @IsOptional()
  @IsString()
  postId?: string;

  @ApiProperty({ example: 'COMMENT_ID_HERE', required: false })
  @IsOptional()
  @IsString()
  commentId?: string;
}
