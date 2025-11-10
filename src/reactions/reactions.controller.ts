import { Controller, Post, Body, Param, Get, Req, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  toggleReaction(@Req() req, @Body() dto: CreateReactionDto) {
    // ✅ Use userId returned by JWT strategy
    return this.reactionsService.toggleReaction(req.user.userId, dto);
  }

  @Get('post/:postId')
  getPostReactions(@Param('postId') postId: string) {
    return this.reactionsService.getReactionsForPost(postId);
  }

  @Get('comment/:commentId')
  getCommentReactions(@Param('commentId') commentId: string) {
    return this.reactionsService.getReactionsForComment(commentId);
  }
}
