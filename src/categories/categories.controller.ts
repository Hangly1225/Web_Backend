import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('categories/list')
  async findAll() {
    const categories = await this.categoriesService.findAll();
    return { categories };
  }

  @Get('add')
  @Render('categories/add')
  async addForm() {
    const brands = await this.prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return { brands };
  }

  @Post()
  async create(@Body() body: Record<string, string>, @Res() res: Response) {
    await this.categoriesService.create(this.toDto(body));
    return res.redirect('/categories');
  }

  @Get(':id')
  @Render('categories/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return { category };
  }

  @Get(':id/edit')
  @Render('categories/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const [category, brands] = await Promise.all([
      this.categoriesService.findOne(id),
      this.prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return { category, brands };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, string>,
    @Res() res: Response,
  ) {
    await this.categoriesService.update(id, this.toDto(body));
    return res.redirect(`/categories/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.categoriesService.remove(id);
    return res.redirect('/categories');
  }

  private toDto(body: Record<string, string>) {
    const name = body.name?.trim();
    const brandId = Number(body.brandId);

    if (!name) {
      throw new BadRequestException('name is required');
    }

    if (Number.isNaN(brandId) || brandId <= 0) {
      throw new BadRequestException('brandId must be a positive number');
    }

    return { name, brandId };
  }
}