import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['USER', 'MODERATOR', 'ADMIN'])
  role?: 'USER' | 'MODERATOR' | 'ADMIN';
}
