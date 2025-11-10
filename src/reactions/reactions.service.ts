import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReactionDto, ReactionType } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  async toggleReaction(userId: string, dto: CreateReactionDto) {
    const { postId, commentId, type } = dto;

    if (!userId) throw new Error('User ID is missing'); // ✅ Safety check

    const existing = await this.prisma.reaction.findFirst({
      where: {
        userId,
        ...(postId ? { postId } : {}),
        ...(commentId ? { commentId } : {}),
      },
    });

    if (existing) {
      if (existing.type === type) {
        await this.prisma.reaction.delete({ where: { id: existing.id } });
        return { message: 'Reaction removed' };
      } else {
        return this.prisma.reaction.update({
          where: { id: existing.id },
          data: { type },
        });
      }
    }

    return this.prisma.reaction.create({
      data: { userId, postId, commentId, type },
    });
  }

  async getReactionsForPost(postId: string) {
    return this.prisma.reaction.findMany({
      where: { postId },
      include: { user: true },
    });
  }

  async getReactionsForComment(commentId: string) {
    return this.prisma.reaction.findMany({
      where: { commentId },
      include: { user: true },
    });
  }
}
