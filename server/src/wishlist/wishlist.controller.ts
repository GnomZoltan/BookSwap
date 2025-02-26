import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import * as jwt from 'jsonwebtoken';

@UseGuards(JwtGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
        
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }
    
    createWishlistDto.userId = decoded.id;
    return this.wishlistService.create(createWishlistDto);
  }

  @Get()
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get('user')
  findByUserId(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
        
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    return this.wishlistService.findByUserId(decoded.id);
  }

  @Get('status/:id')
  checkStatus(@Param('id') bookId: string, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
        
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    return this.wishlistService.checkStatus(bookId, decoded.id);
  }

  @Delete(':id')
  remove(@Param('id') bookId: string, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
        
    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    return this.wishlistService.remove(bookId, decoded.id);
  }
}
