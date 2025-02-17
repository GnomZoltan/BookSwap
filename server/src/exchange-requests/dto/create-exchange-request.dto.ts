import { IsString } from 'class-validator';

export class CreateExchangeRequestDto {
    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;

    @IsString()
    receiverBookId: string;

    @IsString()
    senderBookId: string;
}
