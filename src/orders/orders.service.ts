import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-orders.dto';
import { UpdateOrderDto } from './dto/update-orders.dto';

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

  async findPaginated(query: PaginationQueryDto) {
    const { skip, take } = getPagination(query.page, query.limit);
    const [data, totalItems] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        include: {
          user: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return { data, meta: buildPageMeta(query.page, query.limit, totalItems) };
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

  create(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        status: dto.status,
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: {
        ...(dto.userId !== undefined ? { userId: dto.userId } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}