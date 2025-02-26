import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async calculateAvgRating(userId: string): Promise<number> {
    const result = await this.databaseService.review.aggregate({
      where: { reviewedUserId: userId },
      _avg: { rating: true },
    });

    return result._avg.rating || 0; 
  }
  
  async findAll() {
    const users = await this.databaseService.user.findMany();

    const usersWithAvgRating = await Promise.all(
      users.map(async (user) => {
        const avgRating = await this.calculateAvgRating(user.id);
        return { ...user, avgRating };
      })
    );

    return usersWithAvgRating;
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const avgRating = await this.calculateAvgRating(user.id);
    return { ...user, avgRating };
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      data: updateUserDto,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
