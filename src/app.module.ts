import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
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
import { LoginRedirectMiddleware } from './auth/middleware/login-redirect.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'assets'),
      serveRoot: '/assets',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/api/graphql',
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginRedirectMiddleware).forRoutes(
      { path: 'products', method: RequestMethod.ALL },
      { path: 'brands', method: RequestMethod.ALL },
      { path: 'categories', method: RequestMethod.ALL },
      { path: 'orders', method: RequestMethod.ALL },
      { path: 'users', method: RequestMethod.ALL },
      { path: 'files/upload', method: RequestMethod.ALL },
    );
  }
}

