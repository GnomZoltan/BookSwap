import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreService } from './book-genre.service';

describe('BookGenreService', () => {
  let service: BookGenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookGenreService],
    }).compile();

    service = module.get<BookGenreService>(BookGenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
