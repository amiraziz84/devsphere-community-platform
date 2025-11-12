import { Module, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module'; // ✅ Added

// ⚠️ DO NOT put in providers – only imported to start worker/scheduler once
import './notification.queue';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => EventsModule), // ✅ Added for circular dependency handling
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'devsphere_secret',
    }),
  ],
  controllers: [NotificationsController],
  providers: [
    PrismaService,
    NotificationsService,
    NotificationsGateway,
  ],
  exports: [NotificationsService], // ✅ Exported so EventsModule can inject it
})
export class NotificationsModule {}
