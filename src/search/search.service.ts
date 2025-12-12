import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchAll(query: string) {
    try {
      // -----------------------------------------------
      // Prevent backend crash when no ?q= is provided
      // -----------------------------------------------
      if (!query || typeof query !== 'string' || query.trim() === '') {
        return { users: [], posts: [], tags: [] };
      }

      const q = query.trim().toLowerCase();

      // ------------------------------------------------------
      // USERS SEARCH
      // ------------------------------------------------------
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      // ------------------------------------------------------
      // POSTS SEARCH (TITLE + TAGS)
      // ------------------------------------------------------
      const posts = await this.prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },

            // ⭐ exact tag match
            { tags: { has: q } },

            // ⭐ partial tag match
            { tags: { hasSome: [q] } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          bannerUrl: true,
          tags: true,
          createdAt: true,
        },
      });

      // ------------------------------------------------------
      // UNIQUE TAGS FOR SEARCH DROPDOWN
      // ------------------------------------------------------
      const tagsSet = new Set<string>();

      posts.forEach((post) => {
        post.tags.forEach((tag) => {
          if (tag.toLowerCase().includes(q)) {
            tagsSet.add(tag);
          }
        });
      });

      return {
        users,
        posts,
        tags: Array.from(tagsSet),
      };
    } catch (error) {
      console.error('Search Error:', error);
      return { users: [], posts: [], tags: [] }; // safe fallback
    }
  }
}
