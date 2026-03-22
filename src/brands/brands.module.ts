import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BrandsApiController } from './api/brands-api.controller';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
  controllers: [BrandsController, BrandsApiController],
  providers: [BrandsService, PrismaService],
  exports: [BrandsService],
})
export class BrandsModule {}