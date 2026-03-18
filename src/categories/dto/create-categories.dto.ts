import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description:'The name category'
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}