import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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
    ApiNoContentResponse,
    ApiOkResponse,
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
      res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
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
    @ApiOkResponse({ type: Products })
    @ApiNotFoundResponse({ description: 'Product not found' })
    async findOne(
      @Param('id', ParseIntPipe) id: number,
      @Res({ passthrough: true }) res: Response,
    ) {
      res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
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
    @ApiOkResponse({ type: Products })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
      return this.productsService.update(id, dto);
    }
  
    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiNoContentResponse({ description: 'Product deleted' })
    async remove(@Param('id', ParseIntPipe) id: number) {
      await this.productsService.remove(id);
    }
  }