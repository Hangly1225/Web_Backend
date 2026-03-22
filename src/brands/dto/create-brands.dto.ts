import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
    @ApiProperty({ description: 'Brand name', example: 'Rolex' })
    @IsString()
    @IsNotEmpty()
    name: string;
}