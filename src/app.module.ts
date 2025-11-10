import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { UploadsModule } from './uploads/uploads.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReactionsModule } from './reactions/reactions.module';





@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommentsModule, ReactionsModule, NotificationsModule, UploadsModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
