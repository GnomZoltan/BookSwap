import { Controller, Get, Post, Body, Delete, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: Prisma.UserCreateInput, @Res() res: Response) {
    return this.authService.register(createUserDto, res);
    // return {
    //   status: 'success',
    //   message: 'User registered successfully',
    //   data: {accessToken},
    // };
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Get()
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }

  @Delete()
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
