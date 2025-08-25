import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import * as jwt from 'jsonwebtoken';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@UseGuards(JwtGuard)
@Controller('books')
export class BooksController {

  constructor( private readonly booksService: BooksService ) {}

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

  @Get('search')
  async search(@Req() req: any) {
    const query = req.query.query;
    return this.booksService.searchBooks(query);
  }

  @Get('by-genres')
  async getBooksByGenres(@Query('genres') genres: string) {
    const genreList = genres.split(','); // Parse the genres from a query string
    return this.booksService.findBooksByGenres(genreList);
  }

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
