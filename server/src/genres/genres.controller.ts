import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @UseGuards(JwtGuard)
  @Post()
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

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.genresService.remove(id);
  }
}
