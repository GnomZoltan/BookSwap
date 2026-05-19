import { Injectable, Res, Req } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) {}

  private generateRefreshToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH, { expiresIn: '7d' });
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

    const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
    const refreshToken = this.generateRefreshToken(user.id, user.role);

    res.cookie('jwt-refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).send(accessToken);
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

    const accessToken = this.jwtService.sign({ id: user.id, role: user.role });
    const refreshToken = this.generateRefreshToken(user.id, user.role);

    res.cookie('jwt-refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).send(accessToken);
  }

  refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.cookies['jwt-refresh'];
  
      const claims = jwt.verify(refreshToken, process.env.JWT_REFRESH)  as jwt.JwtPayload;
  
      if (!claims) res.status(401).send({ message: "unaunthenticated" });
  
      const accessToken = this.jwtService.sign({ id: claims.id, role: claims.role });

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
