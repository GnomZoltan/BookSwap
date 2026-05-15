import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { BookGenreModule } from './book-genre/book-genre.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, UsersModule, AuthModule, BooksModule, ReviewsModule, ExchangeRequestsModule, GenresModule, BookPhotosModule, BookGenreModule, WishlistModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
