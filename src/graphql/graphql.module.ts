import { Module } from '@nestjs/common';
import { BrandsModule } from '../brands/brands.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CategoriesResolver } from './resolvers/categories.resolver';
import { ProductsResolver } from './resolvers/products.resolver';
import { BrandsResolver } from './resolvers/brands.resolver';

@Module({
  imports: [ProductsModule, CategoriesModule, BrandsModule],
  providers: [ProductsResolver, CategoriesResolver, BrandsResolver],
})
export class GraphqlModule {}