import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType({ description: 'Input payload to create a brand' })
export class CreateBrandInput {
  @Field({ description: 'Brand name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}