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
  import { CreateCategoryDto } from '../dto/create-categories.dto';
  import { UpdateCategoryDto } from '../dto/update-categories.dto';
  import { Categories } from '../entities/categories.entity';
  import { CategoriesService } from '../categories.service';
  
  @ApiTags('categories')
  @Controller('api/categories')
  export class CategoriesApiController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Get()
    @ApiOperation({ summary: 'List categories with pagination' })
    @ApiPaginatedResponse(Categories)
    async findAll(
      @Query() query: PaginationQueryDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const result = await this.categoriesService.findPaginated(query);
      setPaginationLinks(
        res,
        '/api/categories',
        result.meta.page,
        result.meta.limit,
        result.meta.totalPages,
      );
      return result;
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get one category by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'Category not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.findOne(id);
    }
  
    @Get(':id/products')
    @ApiOperation({ summary: 'Get products of a category' })
    async findCategoryProducts(@Param('id', ParseIntPipe) id: number) {
      const category = await this.categoriesService.findOne(id);
      return category.products;
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a category' })
    @ApiCreatedResponse({ type: Categories })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    create(@Body() dto: CreateCategoryDto) {
      return this.categoriesService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a category' })
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCategoryDto,
    ) {
      return this.categoriesService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a category' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.categoriesService.remove(id);
    }
  }