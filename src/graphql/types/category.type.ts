import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BrandType } from './brand.type';

@ObjectType({ description: 'Category entity' })
export class CategoryType {
  @Field(() => Int, { description: 'Category identifier' })
  id: number;

  @Field({ description: 'Category name' })
  name: string;

  @Field(() => Int, { description: 'Related brand identifier' })
  brandId: number;

  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @Field({ description: 'Last update timestamp' })
  updatedAt: Date;

  @Field(() => BrandType, {
    nullable: true,
    description: 'Brand linked to this category',
  })
  brand?: BrandType;
}
