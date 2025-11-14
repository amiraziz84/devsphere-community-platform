import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('EventsService', () => {
  let service: EventsService;

  const notificationsMock = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: NotificationsService,
          useValue: notificationsMock,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
