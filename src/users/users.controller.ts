import { Controller, Get, Param, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Admin: get all users
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  // 🔹 User: get own profile
  @Get('me')
  getMe(@CurrentUser('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  // 🔹 Admin: update user role
  @Patch(':id/role')
  @Roles('ADMIN')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  // 🔹 Admin: delete user
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
