import { User } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { use } from 'passport';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map((u) => this.deleteUser_password(u));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return this.deleteUser_password(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { name: updateUserDto.name },
    });

    return this.deleteUser_password(updatedUser);
  }

  deleteUser_password(user: User) {
    delete user.password;
    delete user.hashRt;

    return user;
  }
}
