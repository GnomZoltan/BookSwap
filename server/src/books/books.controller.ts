import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import * as jwt from 'jsonwebtoken';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {

  constructor( private readonly booksService: BooksService ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createBookDto: CreateBookDto, @Req() req: any) {

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    createBookDto.userId = decoded.id;

    return this.booksService.create(createBookDto);;
  }

  @Get('owner/:id')
  findByOwnerId(@Param('id') id: string) {
    return this.booksService.findByOwnerId(id);
  }

  @UseGuards(JwtGuard)
  @Post('generate-description')
  async generateDescription(@Body() body: { title: string; author: string }) {
    const description = await this.booksService.generateDescription(body.title, body.author);
    return { description };
  }

  @Get('search')
  async search(@Req() req: any) {
    const query = req.query.query;
    return this.booksService.searchBooks(query);
  }

  @Get('by-genres')
  async getBooksByGenres(@Query('genres') genres: string) {
    const genreList = genres.split(',');
    return this.booksService.findBooksByGenres(genreList);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('available')
  findAllAvailable() {
    return this.booksService.findAllAvailable();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
