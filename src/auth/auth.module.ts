import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategory/jwt.strategy';
import { LocalStrategy } from './strategory/local.strategy';
import { RtStrategory } from './strategory/rt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RtStrategory],
})
export class AuthModule {}
