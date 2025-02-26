import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Injectable()
export class WishlistService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createWishlistDto: CreateWishlistDto) {
    return this.databaseService.wishlist.create({
      data: createWishlistDto,
    });
  }

  async findAll() {
    return this.databaseService.wishlist.findMany({
      include: {
        book: true,
      }
    });
  }

  async findByUserId(userId: string) {
    const wishlist = await this.databaseService.wishlist.findMany({
      where: { userId },
      include: {
        book: {
          include: {
            genre: { include: { genre: true } },
            photos: true,
          }
        },
      },
    });

    return wishlist.map((entry) => entry.book);
  }

  async checkStatus(bookId: string, userId: string) {
    const wishlistEntry = await this.databaseService.wishlist.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return wishlistEntry !== null;
  }

  async remove(bookId: string, userId: string) {
    return this.databaseService.wishlist.delete({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }  
  
}
