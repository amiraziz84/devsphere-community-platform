import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Get all users (Admin only)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 🔹 Get single user by ID
  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // 🔹 Update user role (Admin only)
  async updateRole(id: string, role: string) {
    // Validate input role before updating
    const validRoles: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN];
    if (!validRoles.includes(role as Role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  // 🔹 Delete user (Admin only)
  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
