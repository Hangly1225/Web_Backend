import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: {
        orders: true,
        cartItems: true,
      },
      orderBy: { id: 'desc' },
    });
  }

  async findPaginated(query: PaginationQueryDto) {
    const { skip, take } = getPagination(query.page, query.limit);
    const [data, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        include: {
          orders: true,
          cartItems: true,
        },
        orderBy: { id: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { data, meta: buildPageMeta(query.page, query.limit, totalItems) };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        cartItems: {
          include: { product: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }

  create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: dto.password,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.username !== undefined ? { username: dto.username } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.password !== undefined ? { password: dto.password } : {}),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}