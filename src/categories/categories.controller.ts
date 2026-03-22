import {
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
import { CreateCategoryDto } from './dto/create-categories.dto';
import { UpdateCategoryDto } from './dto/update-categories.dto';
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
    return { pageTitle: 'Categories', categories };
  }

  @Get('add')
  @Render('categories/add')
  async addForm() {
    const brands = await this.prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });
    return { pageTitle: 'Add category', brands };
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto, @Res() res: Response) {
      await this.categoriesService.create(dto);
      return res.redirect('/categories');
  }

  @Get(':id')
  @Render('categories/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoriesService.findOne(id);
    return { pageTitle: `Category #${id}`, category };
  }

  @Get(':id/edit')
  @Render('categories/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const [category, brands] = await Promise.all([
      this.categoriesService.findOne(id),
      this.prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return { pageTitle: `Edit category #${id}`, category, brands };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    await this.categoriesService.update(id, dto);
    return res.redirect(`/categories/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.categoriesService.remove(id);
    return res.redirect('/categories');
  }
}