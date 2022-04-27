import { JwtPayload } from './types/jwt-payload.type';
import { RtGuard } from './../common/guards/rt.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { LocalAuthGuard } from './../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CredentailInfo } from './dto/credential.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  singup(@Body() authDto: AuthDto) {
    return this.authService.signup(authDto);
  }

  @Post('signin')
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: User) {
    return this.authService.singin(user.id, user.email);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@CurrentUser() user: User) {
    this.authService.logout(user.id);
  }

  @Public()
  @Post('/refresh')
  @UseGuards(RtGuard)
  refreshToken(@CurrentUser() jwtPayload: JwtPayload) {
    return this.authService.refresh_refreshToken(
      jwtPayload.sub,
      jwtPayload.refreshToken,
    );
  }

  @Get('me')
  me(@CurrentUser() user: User) {
    return user;
  }

  @Post("/change-credential")
  changeCredentail(@CurrentUser() user: User, @Body() credentailInfo: CredentailInfo) {
    return this.authService.changeCredentail(user.id, credentailInfo);
  }
}
