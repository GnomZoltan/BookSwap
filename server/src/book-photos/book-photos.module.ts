import { Module } from '@nestjs/common';
import { BookPhotosService } from './book-photos.service';
import { BookPhotosController } from './book-photos.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BookPhotosController],
  providers: [BookPhotosService],
})
export class BookPhotosModule {}
