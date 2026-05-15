import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BookGenreService } from 'src/book-genre/book-genre.service';
import { GenresService } from 'src/genres/genres.service';
import { BookPhotosService } from 'src/book-photos/book-photos.service';
import { EmbeddingModule } from 'src/embedding/embedding.module';

@Module({
  imports: [DatabaseModule, EmbeddingModule],
  controllers: [BooksController],
  providers: [BooksService, BookGenreService, GenresService, BookPhotosService],
})
export class BooksModule {}
