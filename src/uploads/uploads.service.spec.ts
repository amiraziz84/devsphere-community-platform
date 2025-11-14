import { Test, TestingModule } from '@nestjs/testing';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        {
          provide: 'CLOUDINARY', // 👈 Cloudinary mock provider
          useValue: {
            upload: jest.fn().mockResolvedValue({
              url: 'https://cloudinary.com/dummy-image.jpg',
              public_id: 'test123',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
