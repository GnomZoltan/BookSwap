import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('myself')
  async findMe(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    const foundUser = await this.usersService.findOne(decoded.id);
    const { password, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    const { password, ...userWithoutPassword } = foundUser;
    return userWithoutPassword;
  }

  @Get('owner/:id')
  async findBookOwner(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    const { email, createdAt, updatedAt, authMethod, role, password, ...clearUser } = foundUser;
    return clearUser;
  }

  @UseGuards(JwtGuard)
  @Patch()
  update(@Body() updateUserDto: Prisma.UserUpdateInput, @Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new Error('Authorization token is missing');
    }

    const decoded = jwt.decode(token) as { id: string };

    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }

    return this.usersService.update(decoded.id, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
