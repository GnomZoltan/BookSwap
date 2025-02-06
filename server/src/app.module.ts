import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ExchangeRequestsModule } from './exchange-requests/exchange-requests.module';
import { GenresModule } from './genres/genres.module';
import { BookPhotosModule } from './book-photos/book-photos.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, BooksModule, ReviewsModule, ExchangeRequestsModule, GenresModule, BookPhotosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
