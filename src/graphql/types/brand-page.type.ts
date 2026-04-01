import { Field, ObjectType } from '@nestjs/graphql';
import { BrandType } from './brand.type';
import { PageMetaType } from './page-meta.type';

@ObjectType({ description: 'Paginated brand collection' })
export class BrandPageType {
  @Field(() => [BrandType], { description: 'Brands on the current page' })
  data: BrandType[];

  @Field(() => PageMetaType, { description: 'Pagination metadata' })
  meta: PageMetaType;
}