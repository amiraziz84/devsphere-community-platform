import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionsService {
constructor(private prisma: PrismaService) {}

async toggleReaction(userId: string, dto: CreateReactionDto) {
const { postId, commentId, type } = dto;
 // 👇 Add this line
  console.log({ userId, postId, commentId, type });


if (!userId) throw new Error('User ID is missing');

const existing = await this.prisma.reaction.findFirst({
  where: {
    userId,
    ...(postId ? { postId: String(postId) } : {}),
    ...(commentId ? { commentId: String(commentId) } : {}),
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
  data: {
    userId,
    postId: postId ? String(postId) : null,
    commentId: commentId ? String(commentId) : null,
    type,
  },
});


}

async getReactionsForPost(postId: string) {
return this.prisma.reaction.findMany({
where: { postId: String(postId) },
include: { user: true },
});
}

async getReactionsForComment(commentId: string) {
return this.prisma.reaction.findMany({
where: { commentId: String(commentId) },
include: { user: true },
});
}
}
