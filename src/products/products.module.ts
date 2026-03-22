import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsApiController } from './api/products-api.controller';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5000,
      max: 100,
    }),
  ],

  controllers: [ProductsController, ProductsApiController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}