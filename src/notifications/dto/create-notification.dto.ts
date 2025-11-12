import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationType } from "@prisma/client";

export class CreateNotificationDto {
  @ApiProperty({ example: "new comment on your post" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: "someone commented on your post" })
  @IsString()
  message: string;

  @ApiProperty({ example: "COMMENT", enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: "post-or-comment-id", required: false })
  @IsString()
  @IsOptional()
  referenceId?: string;
}
