import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Patch } from '@nestjs/common';
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

  // @Post()
  // @UseInterceptors(FilesInterceptor('photos', 10, {
  //   storage: multer.memoryStorage(), // Зберігати файл у пам'яті
  // }))
  // async create(
  //   @Body() createBookDto: CreateBookDto,
  //   @Req() req: any,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   const token = req.headers.authorization?.split(' ')[1];

  //   if (!token) {
  //     throw new Error('Authorization token is missing');
  //   }

  //   const decoded = jwt.decode(token) as { id: string };

  //   if (!decoded || !decoded.id) {
  //     throw new Error('Invalid token');
  //   }

  //   createBookDto.userId = decoded.id;

  //   if (files && files.length > 0) {
  //     const uploadedPhotoUrls: string[] = [];
    
  //     for (const file of files) {
  //       const fileName = `${Date.now()}-${file.originalname}`;
  //       await this.bookPhotosService.uploadPhoto(
  //         file.buffer, // Передаємо buffer замість шляху
  //         'bookhub-storage',
  //         fileName,
  //       );
    
  //       uploadedPhotoUrls.push(`${this.Photo_URL}${fileName}`);
  //     }
    
  //     createBookDto.bookPhotos = uploadedPhotoUrls;
  //   } else {
  //     createBookDto.bookPhotos = []; // Ensure it's always an array
  //   }

  //   createBookDto.condition = Number(createBookDto.condition);
  //   createBookDto.forFree = Boolean(createBookDto.forFree);

  //   return this.booksService.create(createBookDto);
  // }

  @Get('owner/:id')
  findByOwnerId(@Param('id') id: string) {
    return this.booksService.findByOwnerId(id);
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
