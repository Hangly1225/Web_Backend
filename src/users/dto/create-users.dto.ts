import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'Hangly'
    })
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty(
        { description: 'The email of the user',
        example: 'ly1111@gmail.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty(
        { description: 'The password of the user',
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string;
}