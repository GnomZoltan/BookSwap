import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    reviewerId: string;

    @IsString()
    reviewedUserId: string;

    @IsNumber()
    rating: number;
    
    @IsOptional()
    @IsString()
    comment: string;
}
