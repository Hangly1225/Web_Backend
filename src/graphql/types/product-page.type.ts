import { Field, ObjectType } from '@nestjs/graphql';
import { PageMetaType } from './page-meta.type';
import { ProductType } from './product.type';

@ObjectType({ description: 'Paginated product collection' })
export class ProductPageType {
  @Field(() => [ProductType], { description: 'Products on the current page' })
  data: ProductType[];

  @Field(() => PageMetaType, { description: 'Pagination metadata' })
  meta: PageMetaType;
}