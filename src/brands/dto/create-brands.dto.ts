import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({
        description:'The name brand'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}