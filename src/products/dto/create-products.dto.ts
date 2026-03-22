import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'The product name', example: 'Classic Bracelet' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The product description',
    example: 'Elegant bracelet with silver details.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The product price', example: 79.99 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'The product stock', example: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ description: 'The product category id', example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId: number;
}
