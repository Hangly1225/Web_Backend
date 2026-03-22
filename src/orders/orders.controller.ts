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
import { OrderStatus } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  private readonly statuses = Object.values(OrderStatus);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Render('orders/list')
  async findAll() {
    const orders = await this.ordersService.findAll();
    return { pageTitle: 'Orders', orders };
  }

  @Get('add')
  @Render('orders/add')
  async addForm() {
    const users = await this.prisma.user.findMany({
      orderBy: { username: 'asc' },
    });
    return { pageTitle: 'Create order', users, statuses: this.statuses };
  }

  @Post()
  async create(@Body() dto: CreateOrderDto, @Res() res: Response) {
    await this.ordersService.create(dto);
    return res.redirect('/orders');
  }

  @Get(':id')
  @Render('orders/detail')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return { pageTitle: `Order #${id}`, order };
  }

  @Get(':id/edit')
  @Render('orders/edit')
  async editForm(@Param('id', ParseIntPipe) id: number) {
    const [order, users] = await Promise.all([
      this.ordersService.findOne(id),
      this.prisma.user.findMany({ orderBy: { username: 'asc' } }),
    ]);

    return {
      pageTitle: `Edit order #${id}`,
      order,
      users,
      statuses: this.statuses,
    };
  }

  @Post(':id/edit')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    await this.ordersService.update(id, dto);
    return res.redirect(`/orders/${id}`);
  }

  @Post(':id/delete')
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.ordersService.remove(id);
    return res.redirect('/orders');
  }
}