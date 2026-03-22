import { Field, ObjectType } from '@nestjs/graphql';
import { CategoryType } from './category.type';
import { PageMetaType } from './page-meta.type';

@ObjectType({ description: 'Paginated category collection' })
export class CategoryPageType {
  @Field(() => [CategoryType], { description: 'Categories on the current page' })
  data: CategoryType[];

  @Field(() => PageMetaType, { description: 'Pagination metadata' })
  meta: PageMetaType;
}