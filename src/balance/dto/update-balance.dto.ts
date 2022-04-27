import { CreateBalanceDto } from './create-balance.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
