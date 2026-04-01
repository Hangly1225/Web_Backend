import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType({ description: 'Input payload to create a category' })
export class CreateCategoryInput {
  @Field({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Int, { description: 'Related brand identifier' })
  @IsInt()
  @Min(1)
  brandId: number;
}