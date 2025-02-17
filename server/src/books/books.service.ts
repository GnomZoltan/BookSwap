import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBookDto: CreateBookDto) {
    const { genreNames, bookPhotos, ...bookData } = createBookDto;

    const genres = await this.databaseService.genre.findMany({
      where: {
        name: { in: genreNames },
      },
      select: { id: true },
    });

    console.log(genres)

    return this.databaseService.bookForExchange.create({
      data: {
        ...bookData,
        genre: {
          create: genres.map((genre) => ({
            genre: { connect: { id: genre.id } },
          })),
        },
        photos: {
          create: bookPhotos.map((photoUrl) => ({
            photoUrl,
          })),
        },
      },
      include: {
        genre: { include: { genre: true } }, 
        photos: true, 
      },
    });
  }

  async deactivateById(id: string) {
    return this.databaseService.bookForExchange.update({
      data: {
        status: 'SWAPPED'
      },
      where: {
        id
      }
    })
  }

  async findAll() {
    return this.databaseService.bookForExchange.findMany({
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async findOne(id: string) {
    return this.databaseService.bookForExchange.findUnique({
      where: { id },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async update(id: string, updateBookDto: Prisma.BookForExchangeUpdateInput) {
    return this.databaseService.bookForExchange.update({
      data: updateBookDto,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.databaseService.bookForExchange.delete({
      where: { id },
    });
  }
}
