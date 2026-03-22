import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'Category name', example: 'Bracelets' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Related brand id', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    brandId: number;
}