import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [forwardRef(() => NotificationsModule)],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
