import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createAccountDto: CreateAccountDto) {
    try {
      return await this.prisma.account.create({
        data: {
          ...createAccountDto,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException('Account Already Exists');
    }
  }

  async findCurrentUserAccount(userId: string, query: Prisma.AccountInclude) {
    return await this.prisma.account.findMany({
      where: {
        userId,
      },
      include: query,
    });
  }

  async findOne(
    currentUserId: string,
    id: string,
    query: Prisma.AccountInclude,
  ) {
    return await this.findAccount(id, currentUserId, query);
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    await this.findAccount(id);
    return await this.prisma.account.update({
      where: { id },
      data: {
        ...updateAccountDto,
      },
    });
  }

  async remove(id: string) {
    await this.findAccount(id);
    if (await this.isDeleteable(id)) {
      return await this.prisma.account.delete({ where: { id } });
    }
  }

  private async findAccount(
    id: string,
    userId?: string,
    query?: Prisma.AccountInclude,
  ) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      include: query,
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  private async isDeleteable(accountId: string) {
    const balanceWithAccount = await this.prisma.balance.findFirst({
      where: { accountId },
    });

    if (balanceWithAccount) {
      throw new ForbiddenException('Account cannot be deleted');
    }

    return true;
  }
}
