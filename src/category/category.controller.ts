import { isEmpty } from './../utils/is-empty-object';
import { CategoryQueryDto } from './dto/query.dto';
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
import { User } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(user.id, createCategoryDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() categoryQueryDto: CategoryQueryDto,
  ) {
    return this.categoryService.findAll(
      user.id,
      isEmpty(categoryQueryDto) ? null : categoryQueryDto,
    );
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() categoryQueryDto: CategoryQueryDto,
  ) {
    return this.categoryService.findOne(
      user.id,
      id,
      isEmpty(categoryQueryDto) ? null : categoryQueryDto,
    );
  }

  @Patch('/:id')
  updateSubcategory(
    @Param('id') id: string,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(id, category);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
