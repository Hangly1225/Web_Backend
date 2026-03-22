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
  import { CreateBrandDto } from '../dto/create-brands.dto';
  import { UpdateBrandDto } from '../dto/update-brands.dto';
  import { Brands } from '../entities/brands.entity';
  import { BrandsService } from '../brands.service';
  
  @ApiTags('brands')
  @Controller('api/brands')
  export class BrandsApiController {
    constructor(private readonly brandsService: BrandsService) {}
  
    @Get()
    @ApiOperation({ summary: 'List brands with pagination' })
    @ApiPaginatedResponse(Brands)
    async findAll(
      @Query() query: PaginationQueryDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const result = await this.brandsService.findPaginated(query);
      setPaginationLinks(
        res,
        '/api/brands',
        result.meta.page,
        result.meta.limit,
        result.meta.totalPages,
      );
      return result;
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get one brand by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'Brand not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.brandsService.findOne(id);
    }
  
    @Get(':id/categories')
    @ApiOperation({ summary: 'Get categories of a brand' })
    async findBrandCategories(@Param('id', ParseIntPipe) id: number) {
      const brand = await this.brandsService.findOne(id);
      return brand.categories;
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a brand' })
    @ApiCreatedResponse({ type: Brands })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    create(@Body() dto: CreateBrandDto) {
      return this.brandsService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a brand' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
      return this.brandsService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a brand' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.brandsService.remove(id);
    }
  }