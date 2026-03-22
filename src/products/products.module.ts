import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsApiController } from './api/products-api.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController, ProductsApiController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}