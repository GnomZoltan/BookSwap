import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ChatService {
  constructor(private readonly db: DatabaseService) {}

  async findOrCreateConversation(userAId: string, userBId: string, bookId: string) {
    // Always store the smaller ID as userAId for consistent unique constraint
    const [sortedA, sortedB] = [userAId, userBId].sort();

    const existing = await this.db.conversation.findUnique({
      where: {
        userAId_userBId_bookId: {
          userAId: sortedA,
          userBId: sortedB,
          bookId,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, username: true, photoUrl: true } } },
        },
        userA: { select: { id: true, username: true, photoUrl: true } },
        userB: { select: { id: true, username: true, photoUrl: true } },
        book: { select: { id: true, title: true } },
      },
    });

    if (existing) return existing;

    return this.db.conversation.create({
      data: {
        userAId: sortedA,
        userBId: sortedB,
        bookId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { sender: { select: { id: true, username: true, photoUrl: true } } },
        },
        userA: { select: { id: true, username: true, photoUrl: true } },
        userB: { select: { id: true, username: true, photoUrl: true } },
        book: { select: { id: true, title: true } },
      },
    });
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    return this.db.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: { select: { id: true, username: true, photoUrl: true } },
      },
    });
  }

  async getUserConversations(userId: string) {
    return this.db.conversation.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: { select: { id: true, username: true, photoUrl: true } },
        userB: { select: { id: true, username: true, photoUrl: true } },
        book: { select: { id: true, title: true, photos: { select: { photoUrl: true }, take: 1 } } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { id: true, username: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
