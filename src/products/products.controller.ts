import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  Res,
  Sse,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductsService } from './products.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller('products')
@ApiExcludeController()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('products/list')
  async findAll() {
    const products = await this.productsService.findAll();
    return { pageTitle: 'Products', products };
  }

  @Get('add')
  @Render('products/add')
  async addForm() {
    const categories = await this.prisma.category.findMany({
      include: { brand: true },
      orderBy: { name: 'asc' },
    });
    return { pageTitle: 'Add product', categories };
  }

  @Post()
  async create(@Body() dto: CreateProductDto, @Res() res: Response) {
    await this.productsService.create(dto);
    return res.redirect('/products');
  }

  @Get(':id')
  @Render('products/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return { pageTitle: `Product #${id}`, product };
  }

  @Get(':id/edit')
  @Render('products/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const [product, categories] = await Promise.all([
      this.productsService.findOne(id),
      this.prisma.category.findMany({
        include: { brand: true },
        orderBy: { name: 'asc' },
      }),
    ]);
    return { pageTitle: `Edit product #${id}`, product, categories };
  }

  @Post(':id/edit')
  async updateFromForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Res() res: Response,
  ) {
    await this.productsService.update(id, dto);
    return res.redirect(`/products/${id}`);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Post(':id/delete')
  async removeFromForm(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.productsService.remove(id);
    return res.redirect('/products');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return this.productsService
      .stream()
      .pipe(map((event) => ({ data: event }) as MessageEvent));
  }
}