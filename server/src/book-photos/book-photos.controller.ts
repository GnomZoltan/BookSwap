import { Controller, Get, Post, UploadedFiles, UseInterceptors,  Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { BookPhotosService } from './book-photos.service';

@Controller('book-photos')
export class BookPhotosController {
  private readonly Photo_URL = 'https://bookhub-storage.s3.amazonaws.com';

  constructor(private readonly bookPhotosService: BookPhotosService) {}

  @Get()
  findAll() {
    return this.bookPhotosService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('photos', 10, {
    storage: multer.memoryStorage(),
  }))
  async uploadPhoto(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files uploaded or files is not an array');
    }

    const uploadedPhotoUrls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      await this.bookPhotosService.uploadPhoto(file.buffer, 'bookhub-storage', fileName);
      uploadedPhotoUrls.push(`${this.Photo_URL}/${fileName}`);
    }

    return uploadedPhotoUrls.map((url) => ({ fileUrl: url }));
  }

  @Delete(':fileName')
  async deletePhoto(@Param('fileName') fileName: string) {
    try {
      await this.bookPhotosService.deletePhoto('bookhub-storage', fileName);
      return { message: `Фото ${fileName} успішно видалено.` };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Не вдалося видалити фото.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
