import { ApiProperty } from "@nestjs/swagger";
import { Product as ProductModel } from "@prisma/client";
import { Decimal } from '@prisma/client/runtime/library';

export class Products implements ProductModel{
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    price: Decimal;
    @ApiProperty()
    description: string;
    @ApiProperty()
    stock: number;
    @ApiProperty()
    categoryId: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}