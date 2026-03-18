import {
  BadRequestException,
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

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('products/list')
  async findAll() {
    const products = await this.productsService.findAll();
    return { products };
  }

  @Get('add')
  @Render('products/add')
  async addForm() {
    const categories = await this.prisma.category.findMany({
      include: { brand: true },
      orderBy: { name: 'asc' },
    });
    return { categories };
  }

  @Post()
  async create(@Body() body: Record<string, string>, @Res() res: Response) {
    const dto = this.toCreateDto(body);
    this.validateCreateDto(dto);
    await this.productsService.create(dto);
    return res.redirect('/products');
  }

  @Get(':id')
  @Render('products/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return { product };
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
    return { product, categories };
  }

  @Post(':id/edit')
  async updateFromForm(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Record<string, string>,
    @Res() res: Response,
  ) {
    const dto = this.toUpdateDto(body);
    this.validateUpdateDto(dto);
    await this.productsService.update(id, dto);
    return res.redirect(`/products/${id}`);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @Res() res: Response,
  ) {
    this.validateUpdateDto(dto);
    await this.productsService.update(id, dto);
    return res.redirect(`/products/${id}`);
  }

  @Post(':id/delete')
  async removeFromForm(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.productsService.remove(id);
    return res.redirect('/products');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.productsService.remove(id);
    return res.redirect('/products');
  }

  @Sse('events')
  sse(): Observable<MessageEvent> {
    return this.productsService.stream().pipe(
      map((event) => ({ data: event }) as MessageEvent),
    );
  }

  private toCreateDto(body: Record<string, string>): CreateProductDto {
    return {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: Number(body.categoryId),
    };
  }

  private toUpdateDto(body: Record<string, string>): UpdateProductDto {
    return {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      stock: Number(body.stock),
      categoryId: Number(body.categoryId),
      updatedAt: new Date(),
    };
  }

  private validateCreateDto(dto: CreateProductDto) {
    if (!dto.name || !dto.description) {
      throw new BadRequestException('name and description are required');
    }
  }

  private validateUpdateDto(dto: UpdateProductDto) {
    if (dto.name !== undefined && dto.name.trim().length === 0) {
      throw new BadRequestException('name must not be empty');
    }
    
    if (dto.description !== undefined && dto.description.trim().length === 0) {
      throw new BadRequestException('description must not be empty');
    }
  }
}