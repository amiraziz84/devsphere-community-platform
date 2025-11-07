import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor( private prisma: PrismaService){}

  //create a new post
  async create( authorId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...dto,
        authorId,
      },
    });
  }
  // Get all posts (with pagination + tag filter)
  async findAll(page = 1, limit = 10, tag?: string) {
    const skip = (page - 1) * limit;
    const where = tag?{tags:{has:tag}}:{};
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {createdAt: 'desc'},
        include: {
          author: {select: {id: true, name: true, email: true}},
        },
      }),
      this.prisma.post.count({where}),
    ]);
    return {total, page, limit, data};
  }
  //Get single post by id
   async findOne(id: string) {
    return this.prisma.post.findUnique({
      where: {id},
      include: {
        author: {select:{id: true, name: true, email: true}},
        comments: true,
      },
      
    });
  }
  //update post (only author can update)
  async update(id: string, authorId: string, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({where:{id}});
    if(!post || post.authorId !== authorId){
      throw new ForbiddenException('you can not edit this post');
    }
    return this.prisma.post.update({
      where: {id},
      data: dto,
    });
  }
  // delete post (only author or admin)
  async remove(id: string, authorId: string, isAdmin: boolean) {
    const post = await this.prisma.post.findUnique({where:{id}});
    if(!post) throw new ForbiddenException('post not found');
    if(post.authorId! == authorId && !isAdmin){
      throw new ForbiddenException('you can not delete this post.');
    }
    return this.prisma.post.delete({where: {id}});
  }
}
