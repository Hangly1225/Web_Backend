import { ApiProperty } from "@nestjs/swagger";
  import { IsNotEmpty, IsNumber, IsString } from "class-validator";
  
  export class CreateProductDto {
      @ApiProperty({ 
          description: 'The product name',
      })
      @IsString()
      @IsNotEmpty()
      name:string;
  
      @ApiProperty({ 
          description: 'The product description',
      })
      @IsString()
      description: string;
  
      @ApiProperty({ 
          description: 'The product price',
      })
      @IsNumber()
      @IsNotEmpty()
      price: number;
  
      @ApiProperty({ 
          description: 'The product stock',
      })
      @IsNumber()
      @IsNotEmpty()
      stock: number;
  
      @ApiProperty({ 
          description: 'The product categoryId',
      })
      @IsString()
      @IsNotEmpty()
      categoryId: number;
  }