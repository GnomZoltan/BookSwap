import { Controller, Get, Post, UploadedFiles, UseInterceptors,  Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { BookPhotosService } from './book-photos.service';

@Controller('book-photos')
export class BookPhotosController {
  private readonly Photo_URL = 'https://bookhub-storage.s3.amazonaws.com';  // Assuming AWS S3 bucket URL format

  constructor(private readonly bookPhotosService: BookPhotosService) {}

  @Get()
  findAll() {
    return this.bookPhotosService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('photos', 10, {
    storage: multer.memoryStorage(),  // Store file in memory (Buffer)
  }))
  async uploadPhoto(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || !Array.isArray(files)) {
      throw new Error('No files uploaded or files is not an array');
    }

    // Process files and upload
    const uploadedPhotoUrls: string[] = [];
    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      
      // Call the bookPhotosService to handle the actual upload to S3 or another service
      await this.bookPhotosService.uploadPhoto(file.buffer, 'bookhub-storage', fileName);  // Pass buffer instead of file path

      // Add the URL of the uploaded file
      uploadedPhotoUrls.push(`${this.Photo_URL}/${fileName}`);
    }

    // Return the uploaded file URLs
    return uploadedPhotoUrls.map((url) => ({ fileUrl: url }));
  }

  @Delete(':fileName')
  async deletePhoto(@Param('fileName') fileName: string) {
    try {
      // Виклик сервісу для видалення фото
      await this.bookPhotosService.deletePhoto('bookhub-storage', fileName);

      // Повертаємо успішну відповідь
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
