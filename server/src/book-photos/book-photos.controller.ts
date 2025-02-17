import { Controller, Get, UseGuards } from '@nestjs/common';
import { BookPhotosService } from './book-photos.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('book-photos')
export class BookPhotosController {
  constructor(private readonly bookPhotosService: BookPhotosService) {}

  @Get()
  findAll() {
    return this.bookPhotosService.findAll();
  }
}
