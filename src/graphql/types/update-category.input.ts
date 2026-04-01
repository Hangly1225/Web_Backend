import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType({ description: 'Input payload to update a category' })
export class UpdateCategoryInput {
  @Field({ nullable: true, description: 'Category name' })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => Int, { nullable: true, description: 'Related brand identifier' })
  @IsOptional()
  @IsInt()
  @Min(1)
  brandId?: number;
}