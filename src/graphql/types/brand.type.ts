import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Brand entity' })
export class BrandType {
  @Field(() => Int, { description: 'Brand identifier' })
  id: number;

  @Field({ description: 'Brand name' })
  name: string;

  @Field({ description: 'Creation timestamp' })
  createdAt: Date;

  @Field({ description: 'Last update timestamp' })
  updatedAt: Date;
}