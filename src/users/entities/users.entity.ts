import { ApiProperty } from '@nestjs/swagger';
import { User as UserModel } from '@prisma/client';

export class Users implements UserModel {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}