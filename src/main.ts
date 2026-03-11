import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // view engine
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  // session
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? 'dev-session-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60,
      },
    }),
  );

  const parsedPort = Number.parseInt(process.env.PORT ?? '3000', 10);
  const port = Number.isNaN(parsedPort) ? 3000 : parsedPort;
  await app.listen(port);
}

bootstrap();
