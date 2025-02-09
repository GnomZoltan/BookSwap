import { Controller, Get, Post, Body, Delete, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // === LocalStrategyLogin ===
  // @Post('login')
  // @UseGuards(LocalGuard)
  // async login(@Req() req: Request) {
  //   return req.user;
  // }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('register')
  async register(@Body() createUserDto: Prisma.UserCreateInput, @Res() res: Response) {
    return this.authService.register(createUserDto, res);
  }

  @Get()
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }

  @Delete()
  @UseGuards(JwtGuard)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
