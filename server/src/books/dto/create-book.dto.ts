import { IsString, IsNumber, IsBoolean } from 'class-validator';

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
}
