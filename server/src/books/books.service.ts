import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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

  async searchBooks(query: string) {
    if (!query) {
      throw new Error('Query parameter is required for search');
    }
  
    // Пошук за назвою книги
    const booksByTitle = await this.databaseService.bookForExchange.findMany({
      where: {
        title: {
          contains: query, // Пошук часткового збігу
          mode: 'insensitive', // Нечутливий до регістру
        },
      },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  
    // Якщо знайшли книги за назвою — повертаємо результат
    if (booksByTitle.length > 0) {
      return booksByTitle;
    }
  
    // Якщо книг за назвою немає, шукаємо за автором
    return this.databaseService.bookForExchange.findMany({
      where: {
        author: {
          contains: query, // Пошук часткового збігу
          mode: 'insensitive', // Нечутливий до регістру
        },
      },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async findBooksByGenres(genreNames: string[]) {
    if (!genreNames || genreNames.length === 0) {
      throw new Error('Genre names are required');
    }

    return this.databaseService.bookForExchange.findMany({
      where: {
        genre: {
          some: {
            genre: {
              name: { in: genreNames },
            },
          },
        },
      },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }
  
  async findAll() {
    return this.databaseService.bookForExchange.findMany({
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async findAllAvailable() {
    return this.databaseService.bookForExchange.findMany({
      where: {
        status: 'AVAILABLE'
      },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async findByOwnerId(userId: string) {
    return this.databaseService.bookForExchange.findMany({
      where: {
        userId
      },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async findOne(id: string) {
    return this.databaseService.bookForExchange.findUnique({
      where: { id },
      include: { genre: { include: { genre: true } }, photos: true },
    });
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const { genreNames, bookPhotos, ...bookData } = updateBookDto;
  
    // Fetch existing genres based on the provided names
    const genres = await this.databaseService.genre.findMany({
      where: {
        name: { in: genreNames },
      },
      select: { id: true },
    });
  
    return this.databaseService.bookForExchange.update({
      where: { id },
      data: {
        ...bookData,
        genre: {
          deleteMany: {}, // Clear existing genre connections
          create: genres.map((genre) => ({
            genre: { connect: { id: genre.id } },
          })),
        },
        photos: {
          deleteMany: {}, // Clear existing photos
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
  

  async remove(id: string) {
    return this.databaseService.bookForExchange.delete({
      where: { id },
    });
  }
}
