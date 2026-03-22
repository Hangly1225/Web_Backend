import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CategoryType } from './category.type';

@ObjectType({ description: 'Product entity' })
export class ProductType {
  @Field(() => Int, { description: 'Product identifier' })
  id: number;

  @Field({ description: 'Product name' })
  name: string;

  @Field({ description: 'Product description' })
  description: string;

  @Field(() => Float, { description: 'Product price' })
  price: number;

  @Field(() => Int, { description: 'Units in stock' })
  stock: number;

  @Field(() => Int, { description: 'Related category identifier' })
  categoryId: number;

  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @Field({ description: 'Last update timestamp' })
  updatedAt: Date;

  @Field(() => CategoryType, {
    nullable: true,
    description: 'Category linked to this product',
  })
  category?: CategoryType;
}