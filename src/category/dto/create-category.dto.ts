import { CategoryType } from './../../common/enums/category.enum';
import { IsEnum, isEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType;
  
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  parentCategoryId?: string;
}
