import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user;
  
    if (!user) {
      throw new UnauthorizedException('there is no logged in user');
    }

    if (data) {
      return user[data];
    }

    delete user.hashRt;

    return user;
  },
);
