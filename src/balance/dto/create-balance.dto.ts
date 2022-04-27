import { BalanceType } from './../../common/enums/balance.enum';
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

export class CreateBalanceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsEnum(BalanceType)
    @IsNotEmpty()
    balanceType: BalanceType;

    @IsString()
    @IsOptional()
    description: string;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    date: Date;

    @IsString()
    @IsNotEmpty()
    accountId: string;

    @IsString()
    @IsNotEmpty()
    categoryId: string;
}