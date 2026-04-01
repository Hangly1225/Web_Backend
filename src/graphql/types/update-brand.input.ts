import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType({ description: 'Input payload to update a brand' })
export class UpdateBrandInput {
  @Field({ nullable: true, description: 'Brand name' })
  @IsOptional()
  @IsString()
  name?: string;
}