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
import { CreateOrderDto } from '../dto/create-orders.dto';
import { UpdateOrderDto } from '../dto/update-orders.dto';
import { OrdersService } from '../orders.service';
import { Roles } from '../../auth/decorators/roles.decorator';

class OrderApiEntity {
  id: number;
  userId: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@ApiTags('orders')
@ApiCookieAuth('session-cookie')
@Controller('api/orders')
export class OrdersApiController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List orders with pagination' })
  @ApiPaginatedResponse(OrderApiEntity)
  async findAll(
    @Query() query: PaginationQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.ordersService.findPaginated(query);
    setPaginationLinks(
      res,
      '/api/orders',
      result.meta.page,
      result.meta.limit,
      result.meta.totalPages,
    );
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one order by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: OrderApiEntity })
  @ApiNotFoundResponse({ description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Get items of an order' })
  async findItems(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return order.items;
  }

@Get(':id/items/:itemId')
  @ApiOperation({ summary: 'Get one item that belongs to an order' })
  async findItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    const order = await this.ordersService.findOne(id);
    const item = order.items.find((entry) => entry.id === itemId);

    if (!item) {
      throw new NotFoundException(
        `Order item #${itemId} was not found for order #${id}`,
      );
    }
      return item;
  }

  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Create an order' })
  @ApiCreatedResponse({ type: OrderApiEntity })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiOkResponse({ type: OrderApiEntity })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiNotFoundResponse({ description: 'Order not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiOkResponse({ type: OrderApiEntity })
  @ApiNotFoundResponse({ description: 'Order not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}