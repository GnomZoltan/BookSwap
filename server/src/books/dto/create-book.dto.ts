import { IsString, IsNumber, IsBoolean, IsArray, ArrayMinSize } from 'class-validator';

export class CreateBookDto {
    @IsString()
    title: string;

    @IsString()
    author: string;

    @IsString()
    language: string;

    @IsString()
    city: string;

    @IsNumber()
    condition: number;

    @IsBoolean()
    forFree: boolean;

    @IsString()
    description: string; 

    @IsString()
    userId: string; 

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    genreNames: string[]

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    bookPhotos: string[]
}
