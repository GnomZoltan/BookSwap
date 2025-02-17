import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreController } from './book-genre.controller';
import { BookGenreService } from './book-genre.service';

describe('BookGenreController', () => {
  let controller: BookGenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookGenreController],
      providers: [BookGenreService],
    }).compile();

    controller = module.get<BookGenreController>(BookGenreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
