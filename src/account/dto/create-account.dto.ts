import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  openingBalance: number;
  @IsString()
  @IsNotEmpty()
  description: string;
}
