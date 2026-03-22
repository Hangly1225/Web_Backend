import { ApiProperty } from '@nestjs/swagger';
import { Brand as BrandModel } from '@prisma/client';

export class Brands implements BrandModel {
    @ApiProperty()
    id: number;
    @ApiProperty()
    name: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}