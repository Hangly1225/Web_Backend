import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HomeController } from './home.controller';
import { AuthController } from './auth/auth.controller';
import { PagesController } from './pages.controller';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    UsersModule,
  ],
  controllers: [HomeController, AuthController, PagesController],
  providers: [PrismaService],
})
export class AppModule {}
