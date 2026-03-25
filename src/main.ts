import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { EtagInterceptor } from './common/interceptors/etag.interceptor';
import { RequestTimingInterceptor } from './common/interceptors/request-timing.interceptor';
import { SessionAuthGuard } from './auth/guards/session-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

interface AppRequest extends Request {
  session?: {
    user?: string;
    role?: 'user' | 'admin';
  };
} 

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'If-None-Match'],
  });

  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    const request = req as AppRequest;
    res.locals.user = request.session?.user ?? null;
    res.locals.role = request.session?.role ?? null;
    res.locals.menuItems = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Brands', href: '/brands' },
      { label: 'Categories', href: '/categories' },
      { label: 'Orders', href: '/orders' },
      { label: 'Users', href: '/users' },
      { label: 'Swagger', href: '/api/docs' },
      { label: 'GraphQL', href: '/graphql' },
      { label: 'Uploads', href: '/files/upload' },
    ];
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new RequestTimingInterceptor(),
    new EtagInterceptor(),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new SessionAuthGuard(reflector), new RolesGuard(reflector));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Web Backend API')
    .setDescription(
      'RESTful API for products, brands, categories, orders and users',
    )
    .setVersion('1.0.0')
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
      description: 'Session cookie returned by /login',
    }, 'session-cookie')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);
  const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;
  // await app.listen(process.env.PORT || 3000, '0.0.0.0');
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
