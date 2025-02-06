import { Test, TestingModule } from '@nestjs/testing';
import { BookPhotosService } from './book-photos.service';

describe('BookPhotosService', () => {
  let service: BookPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookPhotosService],
    }).compile();

    service = module.get<BookPhotosService>(BookPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
