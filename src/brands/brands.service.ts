import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brands.dto';
import { UpdateBrandDto } from './dto/update-brands.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.brand.findMany({
      include: { categories: true },
      orderBy: { name: 'asc' },
    });
  }

  async findPaginated(query: PaginationQueryDto) {
    const { skip, take } = getPagination(query.page, query.limit);
    const [data, totalItems] = await Promise.all([
      this.prisma.brand.findMany({
        skip,
        take,
        include: { categories: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.brand.count(),
    ]);

    return { data, meta: buildPageMeta(query.page, query.limit, totalItems) };
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }

    return brand;
  }

  create(dto: CreateBrandDto) {
    return this.prisma.brand.create({ data: { name: dto.name } });
  }

  async update(id: number, dto: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({
      where: { id },
      data: { name: dto.name },
    });
  }
  
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.brand.delete({ where: { id } });
  }
}