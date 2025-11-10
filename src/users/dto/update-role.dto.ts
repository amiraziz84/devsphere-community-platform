import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';


export class UpdateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'New role to assign to the user' })
  @IsEnum(Role)
  role: Role;
}
