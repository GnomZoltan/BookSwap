import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateExchangeRequestDto } from './dto/create-exchange-request.dto';

@Injectable()
export class ExchangeRequestsService {

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createExchangeRequestDto: CreateExchangeRequestDto) {
    return this.databaseService.exchangeRequest.create({
      data: {
        ...createExchangeRequestDto,
        status: 'PENDING'
      }
    });
  }

  async approveById(id: string) {
    return this.databaseService.exchangeRequest.update({
      data: {
        status: 'APPROVED'
      },
      where: {
        id
      },
    })
  }

  async declineById(id: string) {
    return this.databaseService.exchangeRequest.update({
      data: {
        status: 'DECLINED'
      },
      where: {
        id
      },
    })
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

  async remove(id: string) {
    return this.databaseService.exchangeRequest.delete({
      where: {
        id,
      }
    });
  }
}
