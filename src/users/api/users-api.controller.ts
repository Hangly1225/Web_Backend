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
  import { Users } from '../entities/users.entity';
  import { CreateUserDto } from '../dto/create-users.dto';
  import { UpdateUserDto } from '../dto/update-users.dto';
  import { UsersService } from '../users.service';
  
  @ApiTags('users')
  @Controller('api/users')
  export class UsersApiController {
    constructor(private readonly usersService: UsersService) {}
  
    @Get()
    @ApiOperation({ summary: 'List users with pagination' })
    @ApiPaginatedResponse(Users)
    async findAll(
      @Query() query: PaginationQueryDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      const result = await this.usersService.findPaginated(query);
      setPaginationLinks(
        res,
        '/api/users',
        result.meta.page,
        result.meta.limit,
        result.meta.totalPages,
      );
      return result;
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get one user by id' })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'User not found' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findOne(id);
    }
  
    @Get(':id/orders')
    @ApiOperation({ summary: 'Get orders of a user' })
    async findOrders(@Param('id', ParseIntPipe) id: number) {
      const user = await this.usersService.findOne(id);
      return user.orders;
    }
  
    @Post()
    @ApiOperation({ summary: 'Create a user' })
    @ApiCreatedResponse({ type: Users })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    create(@Body() dto: CreateUserDto) {
      return this.usersService.create(dto);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
      return this.usersService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.remove(id);
    }
  }