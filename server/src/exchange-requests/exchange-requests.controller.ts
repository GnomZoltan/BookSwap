import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ExchangeRequestsService } from './exchange-requests.service';
import { BooksService } from 'src/books/books.service';
import * as jwt from 'jsonwebtoken';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('exchange-requests')
export class ExchangeRequestsController {
  constructor(
    private readonly exchangeRequestsService: ExchangeRequestsService,
    private readonly booksService: BooksService
  ) {}

  @Post()
  create(@Body() createExchangeRequestDto: CreateExchangeRequestDto, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    
      if (!token) {
        throw new Error('Authorization token is missing');
      }
  
      const decoded = jwt.decode(token) as { id: string };
  
      if (!decoded || !decoded.id) {
        throw new Error('Invalid token');
      }
      
      createExchangeRequestDto.senderId = decoded.id;

    return this.exchangeRequestsService.create(createExchangeRequestDto);
  }

  @Patch('decline/:id')
  // receiver
  declineRequest(@Param('id') id: string) {
    return this.exchangeRequestsService.declineById(id);
  }

  @Patch('approve/:id')
  // receiver
  async approveRequest(@Param('id') requestId: string) {
    this.exchangeRequestsService.approveById(requestId)

    const exchangeRequest = await this.exchangeRequestsService.findOne(requestId);

    const { senderBookId, receiverBookId } = exchangeRequest;

    await Promise.all([
      this.booksService.deactivateById(senderBookId),
      this.booksService.deactivateById(receiverBookId),
    ]);

    return { message: 'Both books marked as SWAPPED successfully' };
  }

  @Get()
  // only yourself, other Admin
  findAll() {
    return this.exchangeRequestsService.findAll();
  }

  @Get(':id')
  // // only yourself
  findOne(@Param('id') id: string) {
    return this.exchangeRequestsService.findOne(id);
  }

  @Delete(':id')
  // only yourself, other Admin
  remove(@Param('id') id: string) {
    return this.exchangeRequestsService.remove(id);
  }
}
