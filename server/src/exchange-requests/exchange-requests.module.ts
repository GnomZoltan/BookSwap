import { Module } from '@nestjs/common';
import { ExchangeRequestsService } from './exchange-requests.service';
import { ExchangeRequestsController } from './exchange-requests.controller';
import { DatabaseModule } from 'src/database/database.module';
import { BooksService } from 'src/books/books.service';
import { EmbeddingModule } from 'src/embedding/embedding.module';

@Module({
  imports: [DatabaseModule, EmbeddingModule],
  controllers: [ExchangeRequestsController],
  providers: [ExchangeRequestsService, BooksService],
})
export class ExchangeRequestsModule {}
