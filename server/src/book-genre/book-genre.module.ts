import { Module } from '@nestjs/common';
import { BookGenreService } from './book-genre.service';
import { BookGenreController } from './book-genre.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookGenreController],
  providers: [BookGenreService],
})
export class BookGenreModule {}
