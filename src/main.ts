import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  // session
  app.use(
    session({
      secret: 'secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );

  await app.listen(3000);
}

bootstrap();
