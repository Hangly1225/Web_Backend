import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { setPaginationLinks } from '../../common/pagination';
import { ApiPaginatedResponse } from '../../common/openai/paginated-response.decorator';
import { Users } from '../entities/users.entity';
import { CreateUserDto } from '../dto/create-users.dto';
import { UpdateUserDto } from '../dto/update-users.dto';
import { UsersService } from '../users.service';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('users')
@ApiCookieAuth('session-cookie')
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
  @ApiOkResponse({ type: Users })
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

  @Get(':id/orders/:orderId')
  @ApiOperation({ summary: 'Get one order that belongs to a user' })
  async findUserOrder(
    @Param('id', ParseIntPipe) id: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    const user = await this.usersService.findOne(id);
    const order = user.orders.find((item) => item.id === orderId);

    if (!order) {
      throw new NotFoundException(
        `Order #${orderId} was not found for user #${id}`,
      );
    }
    return order;
  }

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({ type: Users })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiOkResponse({ type: Users })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiOkResponse({ type: Users })
  @ApiNotFoundResponse({ description: 'User not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}