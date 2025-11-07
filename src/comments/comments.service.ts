import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { error } from 'console';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService){}
  //create comment
  async create(userId: string,createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        postId: createCommentDto.postId,
        parentId: createCommentDto.parentId,
        authorId: userId,
      },
    });
  }
 // reade all comment this post
  async findAllpost(postId: string) {
    return this.prisma.comment.findMany({
      where: {postId},
      include:{
        author: {select: {id: true, name: true,email:true}},
      },
    });
  }
  
   async findOne(id: string) {
     return this.prisma.comment.findUnique({
      where: {id},
      include:{
        author: {select:{id: true, name:true, email: true }},
        post: {select:{id: true, title: true}},
      },
     }) ;
   }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({where:{id}});
    if(!comment) throw new NotFoundException('comment not found');
    if(comment.authorId !== userId) throw new Error('unauthorrized');
    return this.prisma.comment.update({
      where: {id},
      data: {content: updateCommentDto.content},
    }) ;
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({where: {id}});
    if(!comment) throw new NotFoundException('comment not found');
    if(comment.authorId !== userId) throw new Error('unauthorized');
    return this.prisma.comment.delete({where: {id}});
  }
}
