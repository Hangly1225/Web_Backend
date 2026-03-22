import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { GraphqlController } from './graphql.controller';
import { GraphqlLiteService } from './graphql-lite.service';

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [GraphqlController],
  providers: [GraphqlLiteService],
})
export class GraphqlModule {}