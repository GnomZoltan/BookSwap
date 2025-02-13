import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createBookDto: CreateBookDto, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }
    
    createBookDto.userId = decoded.id;
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBookDto: Prisma.BookForExchangeUpdateInput) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
