import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) { }

  async create(currentUserId: string, category: CreateCategoryDto) {

    let targetCategory = {
      name: category.name,
      type: category.type,
      description: category.description,
      user: {
        connect: {
          id: currentUserId,
        },
      },
    }

    if (category.parentCategoryId) {
      targetCategory['parentCategory'] = {
        connect: {
          id: category.parentCategoryId,
        },
      }
    }

    return await this.prisma.category.create({
      data: { ...targetCategory },
    });
  }
  catch(error) {
    throw new ForbiddenException('Category Already Exists');
  }

  async findAll(currentUserId: string, query: Prisma.CategoryInclude) {
    return await this.prisma.category.findMany({
      where: {
        userId: currentUserId,
      },
      include: { ...query, parentCategory: true, subcategories: true },
    });
  }

  async findOne(
    currentUserId: string,
    id: string,
    query: Prisma.CategoryInclude,
  ) {
    return await this.findCategory(id, currentUserId, query);
  }

  async updateCategory(id: string, category: UpdateCategoryDto) {
    await this.findCategory(id);
    return await this.prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        type: category.type,
        description: category.description,
        parentCategory: {
          connect: {
            id: category.parentCategoryId,
          },
        },
      },
      include: { parentCategory: true },
    });
  }

  async remove(id: string) {
    await this.findCategory(id);
    const deletable = await this.isDeletable(id);
    if (deletable) {
      return this.prisma.category.delete({ where: { id } });
    }
  }

  private async findCategory(
    id: string,
    currentUserId?: string,
    query?: Prisma.CategoryInclude,
  ) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId: currentUserId },
      include: query,
    });

    if (!category) {
      return new ForbiddenException('Category not found');
    }

    return category;
  }

  private async isDeletable(categoryId: string) {
    const storedCategory = await this.prisma.balance.findFirst({
      where: {
        categoryId,
      },
    });

    if (storedCategory) {
      throw new NotFoundException('Category cannot be deleted');
    }

    return true;
  }
}
