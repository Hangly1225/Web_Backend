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
import { CreateBrandDto } from './dto/create-brands.dto';
import { UpdateBrandDto } from './dto/update-brands.dto';
import { BrandsService } from './brands.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('brands')
@ApiExcludeController()
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @Render('brands/list')
  async findAll() {
    const brands = await this.brandsService.findAll();
    return { pageTitle: 'Brands', brands };
  }

  @Get('add')
  @Render('brands/add')
  addForm() {
    return { pageTitle: 'Add brand' };
  }

  @Post()
  async create(@Body() dto: CreateBrandDto, @Res() res: Response) {
    await this.brandsService.create(dto);
    return res.redirect('/brands');
  }

  @Get(':id')
  @Render('brands/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    return { pageTitle: `Brand #${id}`, brand };
  }

  @Get(':id/edit')
  @Render('brands/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    return { pageTitle: `Edit brand #${id}`, brand };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBrandDto,
    @Res() res: Response,
  ) {
    await this.brandsService.update(id, dto);
    return res.redirect(`/brands/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.brandsService.remove(id);
    return res.redirect('/brands');
  }
}