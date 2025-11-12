import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostCreatedEvent } from './types/post-created.event';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client'; // ✅ Prisma enum import

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * 🟢 Event Listener: post.created
   * Triggered automatically when a new post is created.
   */
  @OnEvent('post.created')
  async handlePostCreatedEvent(event: PostCreatedEvent) {
    this.logger.log(`📢 Post created: ${event.postId} by ${event.authorId}`);

    try {
      // ✅ Trigger a notification for post creation
      await this.notificationsService.createNotification(event.authorId, {
        title: 'New Post Created',
        message: `User ${event.authorId} created a new post.`,
        type: NotificationType.SYSTEM, // ✅ Using existing enum safely
        referenceId: event.postId,
      });

      this.logger.log(`✅ Notification sent for post ${event.postId}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send notification for post ${event.postId}: ${error.message}`,
      );
    }
  }
}
