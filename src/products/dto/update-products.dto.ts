import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
    @ApiProperty({ 
        description: 'The product name',
        example: 'Product Name'
    })
    name?: string;

    @ApiProperty({ 
        description: 'The product description',
        example: 'Product Description'
    })
    description?: string;

    @ApiProperty({ 
        description: 'The product price',
        example: 100
    })
    price?: number;

    @ApiProperty({ 
        description: 'The product stock',
        example: 1000
    })
    stock?: number;

    @ApiProperty({ 
        description: 'The product category id',
        example: 'category-id'
    })
    categoryId?: number;

    @ApiProperty({ 
        description: 'The product updated date',
        example: '2026-10-03'
    })
    updatedAt: Date;
}