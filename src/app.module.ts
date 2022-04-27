import { JwtGuard } from './common/guards/jwt.guard';
import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { BalanceModule } from './balance/balance.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, './', 'balance-frontend'),
    }),
    CategoryModule,
    AccountModule,
    AuthModule,
    BalanceModule,
    PrismaModule,
    UserModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtGuard }],
})
export class AppModule {}
