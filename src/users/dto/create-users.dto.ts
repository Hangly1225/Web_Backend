import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ description: 'The username of the user', example: 'hangly' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'ly1111@gmail.com',
      })
      @IsEmail()
      @IsNotEmpty()
      email: string;

      @ApiProperty({
        description: 'The password of the user',
        example: 'password123',
      })
      @IsNotEmpty()
      @IsString()
      @MinLength(4)
      password: string;
}