import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { MemoryCacheService } from '../common/cache/memory-cache.service';

@Injectable()
export class ProductsService {
  private readonly events = new Subject<{
    type: string;
    productId: number;
    name: string;
  }>();

  private readonly cacheTtlMs = 5_000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly memoryCache: MemoryCacheService,
  ) {}

  stream() {
    return this.events.asObservable();
  }

  findAll() {
    return this.memoryCache.getOrSet('products:all', this.cacheTtlMs, () =>
      this.prisma.product.findMany({
        include: { category: { include: { brand: true } } },
        orderBy: { id: 'desc' },
      }),
    );
  }

  async findPaginated(query: PaginationQueryDto) {
    const cacheKey = `products:page:${query.page}:limit:${query.limit}`;

    return this.memoryCache.getOrSet(cacheKey, this.cacheTtlMs, async () => {
      const { skip, take } = getPagination(query.page, query.limit);
      const [data, totalItems] = await Promise.all([
        this.prisma.product.findMany({
          skip,
          take,
          include: { category: { include: { brand: true } } },
          orderBy: { id: 'desc' },
        }),
        this.prisma.product.count(),
      ]);

      return { data, meta: buildPageMeta(query.page, query.limit, totalItems) };
    });
  }

  async findOne(id: number) {
    return this.memoryCache.getOrSet(
      `products:item:${id}`,
      this.cacheTtlMs,
      async () => {
        const product = await this.prisma.product.findUnique({
          where: { id },
          include: { category: { include: { brand: true } } },
        });

      if (!product) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      return product;
    });
  }

  async create(dto: CreateProductDto) {
    const created = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        categoryId: dto.categoryId,
      },
    });
    this.memoryCache.deleteByPrefix('products:');
    this.events.next({
      type: 'created',
      productId: created.id,
      name: created.name,
    });
    return created;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      },
    }); 
    this.memoryCache.deleteByPrefix('products:');
    this.events.next({
      type: 'updated',
      productId: updated.id,
      name: updated.name,
    });
    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    const removed = await this.prisma.product.delete({ where: { id } });
    this.memoryCache.deleteByPrefix('products:');
    this.events.next({
      type: 'deleted',
      productId: removed.id,
      name: removed.name,
    });
    return removed;
  }
}