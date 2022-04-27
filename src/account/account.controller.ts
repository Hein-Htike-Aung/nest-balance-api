import { isEmpty } from './../utils/is-empty-object';
import { AccountQueryDto } from './dto/query.dto';
import { User } from '@prisma/client';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(user.id, createAccountDto);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query() accountQueryDto: AccountQueryDto) {
    return this.accountService.findCurrentUserAccount(user.id, isEmpty(accountQueryDto) ? null: accountQueryDto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string, @Query() accountQueryDto: AccountQueryDto) {
    return this.accountService.findOne(user.id, id, isEmpty(accountQueryDto) ? null : accountQueryDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
