import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HomeController } from './home.controller';
import { AuthController } from './auth/auth.controller';
import { PagesController } from './pages.controller';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { GraphqlModule } from './graphql/graphql.module';
import { StorageModule } from './storage/storage.module';
import { GraphqlComplexityPlugin } from './graphql/graphql-complexity.plugin';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      csrfPrevention: false,
      introspection: true,
      plugins: [new GraphqlComplexityPlugin()],
    }),
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    UsersModule,
    OrdersModule,
    GraphqlModule,
    StorageModule,
  ],
  controllers: [HomeController, AuthController, PagesController],
  providers: [PrismaService],
})
export class AppModule {}
