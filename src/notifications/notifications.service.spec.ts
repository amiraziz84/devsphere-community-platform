import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const prismaMock = {
    notification: {
      create: jest.fn().mockResolvedValue({
        id: 1,
        message: 'Test notification',
        userId: 1,
      }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  const gatewayMock = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: NotificationsGateway,
          useValue: gatewayMock,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
