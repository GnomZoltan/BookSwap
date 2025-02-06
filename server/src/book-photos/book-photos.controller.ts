import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookPhotosService } from './book-photos.service';
import { Prisma } from '@prisma/client';

@Controller('book-photos')
export class BookPhotosController {
  constructor(private readonly bookPhotosService: BookPhotosService) {}

  @Post()
  create(@Body() createBookPhotoDto: Prisma.BookPhotoCreateInput) {
    return this.bookPhotosService.create(createBookPhotoDto);
  }

  @Get()
  findAll() {
    return this.bookPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookPhotosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookPhotoDto: Prisma.BookPhotoUpdateInput) {
    return this.bookPhotosService.update(id, updateBookPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookPhotosService.remove(id);
  }
}
