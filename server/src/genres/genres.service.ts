import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class GenresService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createGenreDto: Prisma.GenreCreateInput) {
    return this.databaseService.genre.create({
      data: createGenreDto,
    });
  }

  async findAll() {
    return this.databaseService.genre.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.genre.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: string, updateGenreDto: Prisma.GenreUpdateInput) {
    return this.databaseService.genre.update({
      data: updateGenreDto,
      where: {
        id,
      }
    });
  }

  async remove(id: string) {
    return this.databaseService.genre.delete({
      where: {
        id,
      }
    });
  }
}
