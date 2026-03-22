import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Res,
  } from '@nestjs/common';
  import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
  } from '@nestjs/swagger';
  import { Response } from 'express';
  import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
  import { setPaginationLinks } from '../../common/pagination';
  import { ApiPaginatedResponse } from '../../common/openai/paginated-response.decorator';
  import { Products } from '../entities/products.entity';
  import { CreateProductDto } from '../dto/create-products.dto';
  import { UpdateProductDto } from '../dto/update-products.dto';
  import { ProductsService } from '../products.service';
  
  @ApiTags('products')
  @Controller('api/products')
  export class ProductsApiController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Get()
    @ApiOperation({ summary: 'List products with pagination' })
    @ApiPaginatedResponse(Products)
    async findAll(
      @Query() query: PaginationQueryDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const result = await this.productsService.findPaginated(query);
      setPaginationLinks(
        res,
        '/api/products',
        result.meta.page,
        result.meta.limit,
        result.meta.totalPages,
      );
      return result;
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get one product by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.findOne(id);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a product' })
    @ApiCreatedResponse({ type: Products })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    create(@Body() dto: CreateProductDto) {
      return this.productsService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
      return this.productsService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a product' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.remove(id);
    }
  }