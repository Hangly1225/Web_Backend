import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands/brands.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesResolver } from './resolvers/categories.resolver';
import { ProductsResolver } from './resolvers/products.resolver';
import { GraphqlController } from './graphql.controller';
import { GraphqlLiteService } from './graphql-lite.service';

@Module({
  imports: [ProductsModule, CategoriesModule, BrandsModule],
  controllers: [GraphqlController],
  providers: [ProductsResolver, CategoriesResolver, GraphqlLiteService],
})
export class GraphqlModule {}