import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { CredentailInfo } from './dto/credential.type';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  async signup({ email, password, name }) {
    const hashPassword = await argon.hash(password);

    try {
      const newUser = await this.prisma.user.create({
        data: { name, email, password: hashPassword },
      });

      const tokens = this.generateToken(newUser);

      this.updateRefreshToken(newUser.id, (await tokens).refresh_token);

      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential Taken');
        }
      }

      throw error;
    }
  }

  async logout(id: string) {
    await this.prisma.user.updateMany({
      where: {
        id,
        hashRt: {
          not: null,
        },
      },
      data: {
        hashRt: null,
      },
    });
  }

  async singin(id: string, email: string) {
    const tokens = await this.generateToken({ id, email });

    await this.updateRefreshToken(id, (await tokens).refresh_token);

    return tokens;
  }

  async refresh_refreshToken(id: string, rt: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.hashRt) {
      throw new UnauthorizedException('there is no logged in user');
    }

    const rtMatch = await argon.verify(user.hashRt, rt);
    if (!rtMatch) {
      throw new ForbiddenException('Access Deined');
    }

    const tokens = await this.generateToken(user);

    this.updateRefreshToken(user.id, (await tokens).refresh_token);

    return tokens;
  }

  async checkCredential({ email, password }) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return false;
    }

    const pwdMatch = await argon.verify(user.password, password);

    if (!pwdMatch) {
      return false;
    }

    return user;
  }

  async changeCredentail(id: string, credentialInfo: CredentailInfo) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const checkOldPassword = await argon.verify(
      user.password,
      credentialInfo.oldPassword,
    );

    if (!checkOldPassword) {
      throw new ForbiddenException('Incorret Password');
    }

    const checkNewPassword = await argon.verify(
      user.password,
      credentialInfo.newPassword,
    );

    if (checkNewPassword) {
      throw new ForbiddenException(
        'Old password and new password are the same',
      );
    }

    const hashNewPassword = await argon.hash(credentialInfo.newPassword);

    delete credentialInfo.newPassword;
    delete credentialInfo.oldPassword;

    await this.prisma.user.update({
      where: { id },
      data: { ...credentialInfo, password: hashNewPassword },
    });

    await this.logout(id);
  }

  async generateToken({ id, email }): Promise<Tokens> {
    const payload = {
      sub: id,
      email,
    };

    const [at, rt] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }),
      await this.jwtService.signAsync(payload, {
        expiresIn: '999m',
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRefreshToken(id: string, rt: string) {
    const hashRt = await argon.hash(rt);

    await this.prisma.user.update({ where: { id }, data: { hashRt } });
  }
}
