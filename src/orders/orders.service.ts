import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface SaveOrderDto {
  userId: number;
  status: OrderStatus;
}

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  create(dto: SaveOrderDto) {
    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        status: dto.status,
      },
    });
  }

  async update(id: number, dto: SaveOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        userId: dto.userId,
        status: dto.status,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}