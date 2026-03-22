import { ApiProperty } from '@nestjs/swagger';
import { Category as CategoryModel } from '@prisma/client';

export class Categories implements CategoryModel {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    brandId: number;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}