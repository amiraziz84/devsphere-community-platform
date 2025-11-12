import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { notificationQueue } from './notification.queue';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsGateway))
    private gateway: NotificationsGateway,
  ) {}

  async createNotification(userId: string, dto: CreateNotificationDto) {
    const notif = await this.prisma.notification.create({
      data: {
        userId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        referenceId: dto.referenceId,
      },
    });

    this.gateway.emitToUser(userId, 'newNotification', notif);

    await notificationQueue.add('send-email', {
      userId,
      title: notif.title,
      message: notif.message,
    });

    this.logger.log(`Notification created for user ${userId}`);
    return notif;
  }

  async getUserNotifications(userId: string, status?: 'read' | 'unread') {
    return this.prisma.notification.findMany({
      where: {
        userId,
        ...(status === 'unread' ? { isRead: false } : {}),
        ...(status === 'read' ? { isRead: true } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: `${result.count} notifications marked as read` };
  }

  async deleteNotification(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}
