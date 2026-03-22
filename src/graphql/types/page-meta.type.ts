import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Pagination metadata' })
export class PageMetaType {
  @Field(() => Int, { description: 'Current page number' })
  page: number;

  @Field(() => Int, { description: 'Items per page' })
  limit: number;

  @Field(() => Int, { description: 'Total number of items' })
  totalItems: number;

  @Field(() => Int, { description: 'Total number of pages' })
  totalPages: number;
}