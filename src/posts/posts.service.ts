// src/posts/posts.service.ts
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Express } from 'express';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  // ----------------------------------------------------
  // CREATE POST
  // ----------------------------------------------------
  async create(
    authorId: string,
    dto: CreatePostDto,
    banner?: Express.Multer.File,
  ) {
    const backendURL = process.env.BACKEND_URL ?? "";
    const bannerPath = banner ? `${backendURL}/uploads/${banner.filename}` : null;

    // FIX TAG STRING
    let tagsArray: string[] = [];

    if (dto.tags) {
      try {
        if (typeof dto.tags === 'string') {
          const parsed = JSON.parse(dto.tags);
          tagsArray = Array.isArray(parsed) ? parsed : [];
        } else if (Array.isArray(dto.tags)) {
          tagsArray = dto.tags;
        }
      } catch {
        tagsArray = [];
      }
    }

    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        bannerUrl: bannerPath,
        tags: tagsArray,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true, email: true, profilePic: true  } },
      },
    });
  }

  // ----------------------------------------------------
  // GET ALL POSTS
  // ----------------------------------------------------
  async findAll(page = 1, limit = 10, tag?: string, search?: string) {
    const skip = (page - 1) * limit;
    const backendURL = process.env.BACKEND_URL ?? "";

    let where: any = {};

    if (tag) where.tags = { has: tag };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
        },
      }),

      this.prisma.post.count({ where }),
    ]);

    // ⭐ FIX TAG + BANNER URL
    const normalized = posts.map((post) => ({
      ...post,

      // FIX bannerUrl duplicates
      bannerUrl: post.bannerUrl
        ? post.bannerUrl.startsWith("http")
          ? post.bannerUrl
          : `${backendURL}${post.bannerUrl}`
        : null,

      // FIX TAGS BLINK ISSUE
      tags: Array.isArray(post.tags)
        ? post.tags.flatMap((t) => {
            try {
              const parsed = JSON.parse(t);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return [t];
            }
          })
        : [],
    }));

    return {
      total,
      page,
      limit,
      data: normalized,
    };
  }

  // ----------------------------------------------------
  // GET SINGLE POST
  // ----------------------------------------------------
  async findOne(id: string) {
    const backendURL = process.env.BACKEND_URL ?? "";

    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: true,
      },
    });

    if (!post) return null;

    return {
      ...post,
      bannerUrl: post.bannerUrl
        ? post.bannerUrl.startsWith("http")
          ? post.bannerUrl
          : `${backendURL}${post.bannerUrl}`
        : null,
    };
  }

  // ----------------------------------------------------
  // UPDATE POST
  // ----------------------------------------------------
  async update(id: string, authorId: string, dto: UpdatePostDto) {
    const backendURL = process.env.BACKEND_URL ?? "";

    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== authorId) {
      throw new ForbiddenException('You cannot edit this post');
    }

    let tagsArray: string[] | undefined;

    if (dto.tags) {
      try {
        if (typeof dto.tags === 'string') {
          const parsed = JSON.parse(dto.tags);
          tagsArray = Array.isArray(parsed) ? parsed : [];
        } else if (Array.isArray(dto.tags)) {
          tagsArray = dto.tags;
        }
      } catch {
        tagsArray = [];
      }
    }

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
        bannerUrl: dto.bannerUrl
          ? `${backendURL}/uploads/${dto.bannerUrl}`
          : post.bannerUrl,
        tags: tagsArray,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      ...updated,
      bannerUrl: updated.bannerUrl
        ? updated.bannerUrl.startsWith("http")
          ? updated.bannerUrl
          : `${backendURL}${updated.bannerUrl}`
        : null,
    };
  }

  // ----------------------------------------------------
  // DELETE POST
  // ----------------------------------------------------
  async remove(id: string, authorId: string, isAdmin: boolean) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) throw new ForbiddenException('Post not found');

    if (post.authorId !== authorId && !isAdmin) {
      throw new ForbiddenException('You cannot delete this post.');
    }

    return this.prisma.post.delete({ where: { id } });
  }
}
