import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    return this.prisma.$transaction(async (tx) => {
      if (
        (dto.productId === undefined) !== (dto.quantity === undefined)
      ) {
        throw new BadRequestException(
          'productId and quantity must be provided together',
        );
      }

      let itemCreateData:
        | { product: { connect: { id: number } }; quantity: number; unitPrice: string }
        | undefined;
      if (dto.productId !== undefined) {
        const product = await tx.product.findUnique({
          where: { id: dto.productId },
          select: { price: true },
        });

        if (!product) {
          throw new BadRequestException(
            `Product #${dto.productId} does not exist`,
          );
        }
        itemCreateData = {
          product: { connect: { id: dto.productId } },
          quantity: dto.quantity as number,
          unitPrice: product.price.toString(),
        };
      }

      return tx.order.create({
        data: {
          user: { connect: { id: dto.userId } },
          status: dto.status,
          ...(itemCreateData
            ? {
                items: {
                  create: [itemCreateData],
                },
              }
            : {}),
        },
      });
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      if ((dto.productId === undefined) !== (dto.quantity === undefined)) {
        throw new BadRequestException(
          'productId and quantity must be provided together',
        );
      }

      let itemCreateData:
        | { product: { connect: { id: number } }; quantity: number; unitPrice: string }
        | undefined;
      if (dto.productId !== undefined) {
        const product = await tx.product.findUnique({
          where: { id: dto.productId },
          select: { price: true },
        });

        if (!product) {
          throw new BadRequestException(
            `Product #${dto.productId} does not exist`,
          );
        }
        itemCreateData = {
          product: { connect: { id: dto.productId } },
          quantity: dto.quantity as number,
          unitPrice: product.price.toString(),
        };
      }

      return tx.order.update({
        where: { id },
        data: {
          ...(dto.userId !== undefined
            ? { user: { connect: { id: dto.userId } } }
            : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(itemCreateData
            ? {
                items: {
                  deleteMany: {},
                  create: [itemCreateData],
                },
              }
            : {}),
        },
      });
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}