import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async create(currentUserId: string, createBalanceDto: CreateBalanceDto) {
    return await this.prisma.balance.create({
      data: {
        name: createBalanceDto.name,
        description: createBalanceDto.description,
        date: createBalanceDto.date,
        amount: createBalanceDto.amount,
        balanceType: createBalanceDto.balanceType,
        user: {
          connect: { id: currentUserId },
        },
        category: {
          connect: { id: createBalanceDto.categoryId },
        },
        account: {
          connect: { id: createBalanceDto.accountId },
        },
      },
    });
  }

  async findAll(currentUserId: string, query: Prisma.BalanceInclude) {
    return await this.prisma.balance.findMany({
      where: {
        userId: currentUserId,
      },
      include: {...query, category: true, account: true}
    });
  }

  async findOne(
    currentUserId: string,
    id: string,
    query: Prisma.BalanceInclude,
  ) {
    await this.findBalance(id);

    return await this.prisma.balance.findFirst({
      where: {
        id,
        userId: currentUserId,
      },
      include: query,
    });
  }

  async update(id: string, updateBalanceDto: UpdateBalanceDto) {
    await this.findBalance(id);
    return await this.prisma.balance.update({
      where: { id },
      data: {
        ...updateBalanceDto,
      },
    });
  }

  async remove(id: string) {
    await this.findBalance(id);
    await this.prisma.balance.delete({
      where: { id },
    });
  }

  private async findBalance(id: string) {
    const balance = await this.prisma.balance.findUnique({
      where: {
        id,
      },
    });

    if (!balance) {
      throw new ForbiddenException('Balance Not found');
    }

    return balance;
  }
}
