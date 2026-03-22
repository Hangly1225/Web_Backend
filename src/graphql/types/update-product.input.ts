import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType({ description: 'Input payload to update a product' })
export class UpdateProductInput {
  @Field({ nullable: true, description: 'Product name' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true, description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float, { nullable: true, description: 'Product price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Int, { nullable: true, description: 'Available stock quantity' })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @Field(() => Int, { nullable: true, description: 'Related category identifier' })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;
}