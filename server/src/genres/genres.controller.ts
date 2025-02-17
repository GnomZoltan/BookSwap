import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Post()
  // Admin
  create(@Body() createGenreDto: Prisma.GenreCreateInput) {
    return this.genresService.create(createGenreDto);
  }

  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.genresService.findOne(name);
  }

  @Delete(':id')
  // Admin
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
