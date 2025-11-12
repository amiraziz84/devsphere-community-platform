import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Create a new notification
  @Post()
  create(@Req() req, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.createNotification(req.user.userId, dto);
  }

  // Get notifications with optional filter (?status=unread|read)
  @Get()
  getMine(@Req() req, @Query('status') status?: 'read' | 'unread') {
    return this.notificationsService.getUserNotifications(req.user.userId, status);
  }

  // Mark single notification as read
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // Mark all as read
  @Patch('read/all')
  markAllRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  // Delete single notification
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }
}
