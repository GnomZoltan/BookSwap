import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExchangeRequestsService } from './exchange-requests.service';
import { Prisma } from '@prisma/client';

@Controller('exchange-requests')
export class ExchangeRequestsController {
  constructor(private readonly exchangeRequestsService: ExchangeRequestsService) {}

  @Post()
  create(@Body() createExchangeRequestDto: Prisma.ExchangeRequestCreateInput) {
    return this.exchangeRequestsService.create(createExchangeRequestDto);
  }

  @Get()
  findAll() {
    return this.exchangeRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRequestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExchangeRequestDto: Prisma.ExchangeRequestUpdateInput) {
    return this.exchangeRequestsService.update(id, updateExchangeRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeRequestsService.remove(id);
  }
}
