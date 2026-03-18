import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'Hangly'
    })
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'ly1111@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password123'
    })
    @IsNotEmpty()
    @IsString()
    password?: string;
}