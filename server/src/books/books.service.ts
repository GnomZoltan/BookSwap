import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: CreateBookDto) {
    return this.databaseService.bookForExchange.create({
      data: createBookDto
    });
  }

  async findAll() {
    return this.databaseService.bookForExchange.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.bookForExchange.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: string, updateBookDto: Prisma.BookForExchangeUpdateInput) {
    return this.databaseService.bookForExchange.update({
      data: updateBookDto,
      where: {
        id,
      }
    });
  }

  async remove(id: string) {
    return this.databaseService.bookForExchange.delete({
      where: {
        id
      }
    });
  }
}
