import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
          throw new Error('Authorization token is missing');
        }

        const decoded = jwt.decode(token) as { id: string };

        if (!decoded || !decoded.id) {
          throw new Error('Invalid token');
        }

        createReviewDto.reviewerId = decoded.id;
    return this.reviewsService.create(createReviewDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('reviewer/:id')
  findByReviewer(@Param('id') reviewerId: string) {
    return this.reviewsService.findByReviewerId(reviewerId);
  }

  @Get('reviewed/:id')
  findByReviewed(@Param('id') reviewedId: string) {
    return this.reviewsService.findByReviewedId(reviewedId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: Prisma.ReviewUpdateInput) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
