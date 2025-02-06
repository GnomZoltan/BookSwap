import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ExchangeRequestsService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createExchangeRequestDto: Prisma.ExchangeRequestCreateInput) {
    return this.databaseService.exchangeRequest.create({
      data: createExchangeRequestDto,
    });
  }

  async findAll() {
    return this.databaseService.exchangeRequest.findMany();
  }

  async findOne(id: string) {
    return this.databaseService.exchangeRequest.findUnique({
      where: {
        id,
      }
    });
  }

  async update(id: string, updateExchangeRequestDto: Prisma.ExchangeRequestUpdateInput) {
    return this.databaseService.exchangeRequest.update({
      data: updateExchangeRequestDto,
      where: {
        id,
      }
    });
  }

  async remove(id: string) {
    return this.databaseService.exchangeRequest.delete({
      where: {
        id,
      }
    });
  }
}
