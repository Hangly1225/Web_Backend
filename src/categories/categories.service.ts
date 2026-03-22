import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      include: { brand: true, products: true },
      orderBy: { name: 'asc' },
    });
  }

  async findPaginated(query: PaginationQueryDto) {
    const { skip, take } = getPagination(query.page, query.limit);
    const [data, totalItems] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take,
        include: { brand: true, products: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.category.count(),
    ]);

    return { data, meta: buildPageMeta(query.page, query.limit, totalItems) };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { brand: true, products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return category;
  }

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}