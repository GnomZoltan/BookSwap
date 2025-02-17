import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BookGenreService {

  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return this.databaseService.bookGenre.findMany();
  }
}
