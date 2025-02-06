import { PartialType } from '@nestjs/mapped-types';
import { CreateBookPhotoDto } from './create-book-photo.dto';

export class UpdateBookPhotoDto extends PartialType(CreateBookPhotoDto) {}
