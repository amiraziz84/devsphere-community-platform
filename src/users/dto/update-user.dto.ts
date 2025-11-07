import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Amir Aziz', description: 'Updated name of the user', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'amir@example.com', description: 'Updated email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
