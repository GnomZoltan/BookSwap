import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BookGenreService } from 'src/book-genre/book-genre.service';
import { GenresService } from 'src/genres/genres.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BooksController],
  providers: [BooksService, BookGenreService, GenresService],
})
export class BooksModule {}
