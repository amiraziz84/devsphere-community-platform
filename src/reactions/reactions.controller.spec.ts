import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsController } from './reactions.controller';
import { ReactionsService } from './reactions.service';

describe('ReactionsController', () => {
  let controller: ReactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionsController],
      providers: [
        {
          provide: ReactionsService,
          useValue: {
            createReaction: jest.fn().mockResolvedValue({
              id: 1,
              type: 'LIKE',
            }),
            removeReaction: jest.fn().mockResolvedValue({
              success: true,
            }),
            getReactionsByPost: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<ReactionsController>(ReactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
