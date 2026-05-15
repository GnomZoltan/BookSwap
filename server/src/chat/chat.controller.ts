import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import * as jwt from 'jsonwebtoken';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversation/:bookId/:otherUserId')
  async findOrCreate(@Param('bookId') bookId: string, @Param('otherUserId') otherUserId: string, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.decode(token) as { id: string };
    return this.chatService.findOrCreateConversation(decoded.id, otherUserId, bookId);
  }

  @Get('conversations')
  async getUserConversations(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.decode(token) as { id: string };
    return this.chatService.getUserConversations(decoded.id);
  }
}
