import { Test, TestingModule } from '@nestjs/testing';
import { BookPhotosController } from './book-photos.controller';
import { BookPhotosService } from './book-photos.service';

describe('BookPhotosController', () => {
  let controller: BookPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookPhotosController],
      providers: [BookPhotosService],
    }).compile();

    controller = module.get<BookPhotosController>(BookPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
