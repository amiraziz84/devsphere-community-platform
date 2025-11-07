import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@CurrentUser('userId') userId: string,  @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @Get(':postId')
  findAllpost(@Param('postId') postId: string) {
    return this.commentsService.findAllpost(postId);
  }

   @Get('single/:id')
   findOne(@Param('id') id: string) {
     return this.commentsService.findOne(id);
   }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, req.userId, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.commentsService.remove(id,req.userId);
  }
}
