import { Controller, Get, Query, Render, Redirect } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class PagesController {
  @Get('index')
  @Redirect('/', 302)
  index() {
    return;
  }

  @Get('shop')
  @Redirect('/', 302)
  shop() {
    return;
  }

  @Get('cart')
  @Redirect('/orders', 302)
  cart() {
    return;
  }

  @Get('brand')
  @Redirect('/brands', 302)
  brand() {
    return;
  }

  @Get('category')
  @Redirect('/categories', 302)
  category() {
    return;
  }

  @Get('list')
  @Redirect('/products', 302)
  list() {
    return;
  }

  @Get('login')
  @Render('pages/login')
  loginPage(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('signup')
  @Render('pages/signup')
  signup(@Query('user') user?: string) {
    return { user: user ?? null };
  }
}