import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsString } from 'class-validator';
export class CredentailInfo {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  newPassword: string;
};
