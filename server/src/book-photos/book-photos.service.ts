import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BookPhotosService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookPhotoDto: Prisma.BookPhotoCreateInput) {
    return this.databaseService.bookPhoto.create({
      data: createBookPhotoDto,
    });
  }

  async findAll() {
    return this.databaseService.bookPhoto.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.bookPhoto.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: string, updateBookPhotoDto: Prisma.BookPhotoUpdateInput) {
    return this.databaseService.bookPhoto.update({
      data: updateBookPhotoDto,
      where: {
        id,
      }
    });
  }

  async remove(id: string) {
    return this.databaseService.bookPhoto.delete({
      where: {
        id,
      }
    });
  }
}
