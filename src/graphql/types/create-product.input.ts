import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

@InputType({ description: 'Input payload to create a product' })
export class CreateProductInput {
  @Field({ description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Product description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float, { description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Int, { description: 'Available stock quantity' })
  @IsInt()
  @Min(0)
  stock: number;

  @Field(() => Int, { description: 'Related category identifier' })
  @IsInt()
  @Min(1)
  categoryId: number;
}