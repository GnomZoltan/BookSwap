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

  async getSent(senderId: string) {
    return this.databaseService.exchangeRequest.findMany({
      where: {
        senderId,
      },
      include: {
        receiver: {
          select : {
            username: true,
          },
        },
        senderBook: {
          select : {
            title: true,
          },
        },
        receiverBook: {
          select : {
            title: true,
          },
        },
      },
    }).then(exhangeRequests =>
      exhangeRequests.map(exhangeRequest => ({
        ...exhangeRequest,
        receiverId: exhangeRequest.receiver.username, // Replace reviewedUserId with username
        receiver: undefined, // Remove the original nested object
        senderBookId: exhangeRequest.senderBook.title, // Replace reviewedUserId with username
        senderBook: undefined, // Remove the original nested object
        receiverBookId: exhangeRequest.receiverBook.title, // Replace reviewedUserId with username
        receiverBook: undefined, // Remove the original nested object
      }))
    );
  }

  async getReceived(receiverId: string) {
    return this.databaseService.exchangeRequest.findMany({
      where: {
        receiverId,
      },
      include: {
        sender: {
          select : {
            username: true,
          },
        },
        senderBook: {
          select : {
            title: true,
          },
        },
        receiverBook: {
          select : {
            title: true,
          },
        },
      },
    }).then(exhangeRequests =>
      exhangeRequests.map(exhangeRequest => ({
        ...exhangeRequest,
        senderId: exhangeRequest.sender.username, // Replace reviewedUserId with username
        sender: undefined, // Remove the original nested object
        senderBookId: exhangeRequest.senderBook.title, // Replace reviewedUserId with username
        senderBook: undefined, // Remove the original nested object
        receiverBookId: exhangeRequest.receiverBook.title, // Replace reviewedUserId with username
        receiverBook: undefined, // Remove the original nested object
      }))
    );
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
