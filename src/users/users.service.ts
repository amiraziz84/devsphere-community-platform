import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePic: true,
        createdAt: true,
      },
    });
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profilePic: true,
        createdAt: true,
      },
    });
  }

  async updateRole(id: string, role: string) {
    const validRoles: Role[] = [Role.USER, Role.MODERATOR, Role.ADMIN];
    if (!validRoles.includes(role as Role)) throw new Error(`Invalid role: ${role}`);

    return this.prisma.user.update({
      where: { id },
      data: { role: role as Role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: { id: true, name: true, email: true },
    });
  }

  // 🔹 Update profile picture
  async updateProfilePic(userId: string, filename: string) {
  // Remove ANY 'uploads/profile/' from beginning
  let cleaned = filename.replace(/uploads\/profile\//g, "").replace(/^\//, "");

  // Final correct path
  const profilePicPath = `/uploads/profile/${cleaned}`;

  return this.prisma.user.update({
    where: { id: userId },
    data: { profilePic: profilePicPath },
    select: {
      id: true,
      name: true,
      email: true,
      profilePic: true,
    },
  });
}
}
