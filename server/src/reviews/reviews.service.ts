import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.databaseService.review.create({
      data: createReviewDto,
    });
  }

  async findAll() {
    return this.databaseService.review.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.review.findUnique({
      where: {
        id,
      }
    });
  }

  async findByReviewerId(reviewerId: string) {
    return this.databaseService.review.findMany({
      where: {
        reviewerId,
      }
    });
  }

  async findByReviewedId(reviewedUserId: string) {
    return this.databaseService.review.findMany({
      where: {
        reviewedUserId,
      }
    });
  }

  async update(id: string, updateReviewDto: Prisma.ReviewUpdateInput) {
    return this.databaseService.review.update({
      data: updateReviewDto,
      where: {
        id,
      }
    });
  }

  async remove(id: string) {
    return this.databaseService.review.delete({
      where: {
        id,
      }
    });
  }
}
