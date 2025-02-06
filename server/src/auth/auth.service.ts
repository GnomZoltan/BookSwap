import { Injectable, Res, Req } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {

  constructor(private readonly databaseService: DatabaseService) {}

  private generateAccessToken(userId: string): string {
    return jwt.sign({ id: userId}, process.env.JWT_ACCESS, {
      expiresIn: '1h',
    })
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ id: userId}, process.env.JWT_REFRESH);
  }

  async register(createUserDto: Prisma.UserCreateInput, @Res() res: Response) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt); 

    const user = await this.databaseService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        authMethod: 'MANUAL',
        role: "USER"
      }
    });

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    res.cookie('jwt-refresh', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      //maxAge: 1.5 * 60 * 1000
    })

    res.send(accessToken);
  }

  async login(loginDto: LoginDto, @Res() res: Response) {
    const email = loginDto.email;
    const password = loginDto.password;

    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) return res.status(404).send({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ message: "Bad credentials" });

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    res.cookie('jwt-refresh', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.send(accessToken);
  }

  refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['jwt-refresh'];
  
      const claims = jwt.verify(refreshToken, process.env.JWT_REFRESH);
  
      if (!claims) res.status(401).send({ message: "unaunthenticated" });
  
      const accessToken = this.generateAccessToken(claims.id);
  
      res.send(accessToken);
    } catch (err) {
      return res.status(401).send({ message: err.message });
    }
  }

  logout(@Res() res: Response) {
    res.cookie("jwt-refresh", "", { maxAge: 0 });

    res.send({
      message: "success",
    });
  }
}
