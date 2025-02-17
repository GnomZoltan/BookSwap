import { Controller, Get, UseGuards } from '@nestjs/common';
import { BookGenreService } from './book-genre.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('book-genre')
export class BookGenreController {
  constructor(private readonly bookGenreService: BookGenreService) {}

  @Get()
  findAll() {
    return this.bookGenreService.findAll();
  }
}
