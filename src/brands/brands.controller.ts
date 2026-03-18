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
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @Render('brands/list')
  async findAll() {
    const brands = await this.brandsService.findAll();
    return { brands };
  }

  @Get('add')
  @Render('brands/add')
  addForm() {
    return {};
  }

  @Post()
  async create(@Body('name') name: string, @Res() res: Response) {
    await this.brandsService.create(this.normalizeName(name));
    return res.redirect('/brands');
  }

  @Get(':id')
  @Render('brands/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    return { brand };
  }

  @Get(':id/edit')
  @Render('brands/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    return { brand };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Res() res: Response,
  ) {
    await this.brandsService.update(id, this.normalizeName(name));
    return res.redirect(`/brands/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.brandsService.remove(id);
    return res.redirect('/brands');
  }

  private normalizeName(name?: string) {
    const normalized = name?.trim();
    if (!normalized) {
      throw new BadRequestException('name is required');
    }
    return normalized;
  }
}