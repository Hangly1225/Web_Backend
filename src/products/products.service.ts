import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly events = new Subject<{ type: string; productId: number; name: string }>();

  constructor(private readonly prisma: PrismaService) {}

  stream() {
    return this.events.asObservable();
  }

  findAll() {
    return this.prisma.product.findMany({ include: { brand: true, category: true }, orderBy: { id: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id }, include: { brand: true, category: true } });
  }

  async create(dto: CreateProductDto) {
    const created = await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
    this.events.next({ type: 'created', productId: created.id, name: created.name });
    return created;
  }

  async update(id: number, dto: UpdateProductDto) {
    const data: any = {
      ...dto,
      ...(dto.brandId !== undefined ? { brand: { connect: { id: dto.brandId } } } : {}),
      ...(dto.categoryId !== undefined ? { category: { connect: { id: dto.categoryId } } } : {}),
    };
    const updated = await this.prisma.product.update({ where: { id }, data });
    this.events.next({ type: 'updated', productId: updated.id, name: updated.name });
    return updated;
  }

  async remove(id: number) {
    const removed = await this.prisma.product.delete({ where: { id } });
    this.events.next({ type: 'deleted', productId: removed.id, name: removed.name });
    return removed;
  }
}