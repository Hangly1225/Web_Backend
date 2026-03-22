import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { buildPageMeta, getPagination } from '../common/pagination';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  stream() {
    return this.events.asObservable();
  }

  async findAll() {
    return this.getOrSet('products:all', async () =>
    this.prisma.product.findMany({
      include: { category: { include: { brand: true } } },
      orderBy: { id: 'desc' },
    }),
  );
}

  async findPaginated(query: PaginationQueryDto) {
    const cacheKey = `products:page:${query.page}:limit:${query.limit}`;

    return this.getOrSet(cacheKey, async () => {
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
    return this.getOrSet(`products:item:${id}`,
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

    await this.invalidateProductsCache();
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
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.stock !== undefined ? { stock: dto.stock } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      },
    }); 

    await this.invalidateProductsCache(id);
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
    
    await this.invalidateProductsCache(id);
    this.events.next({
      type: 'deleted',
      productId: removed.id,
      name: removed.name,
    });
    return removed;
  }

  private async getOrSet<T>(key: string, loader: () => Promise<T>): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) {
      return cached;
    }

    const value = await loader();
    await this.cacheManager.set(key, value, this.cacheTtlMs);
    return value;
  }

  private async invalidateProductsCache(itemId?: number) {
    const keys = ['products:all'];
    if (itemId !== undefined) {
      keys.push(`products:item:${itemId}`);
    }

    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}