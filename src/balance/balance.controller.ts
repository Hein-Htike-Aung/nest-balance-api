import { isEmpty } from './../utils/is-empty-object';
import { BalanceQueryDto } from './dto/query.dto';
import { User } from '@prisma/client';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create-balance.dto';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createBalanceDto: CreateBalanceDto,
  ) {
    return this.balanceService.create(user.id, createBalanceDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() balanceQueryDto: BalanceQueryDto,
  ) {
    return this.balanceService.findAll(
      user.id,
      isEmpty(balanceQueryDto) ? null : balanceQueryDto,
    );
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() balanceQueryDto: BalanceQueryDto,
  ) {
    return this.balanceService.findOne(
      user.id,
      id,
      isEmpty(balanceQueryDto) ? null : balanceQueryDto,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBalanceDto: UpdateBalanceDto) {
    return this.balanceService.update(id, updateBalanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.balanceService.remove(id);
  }
}
