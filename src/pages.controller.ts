import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class PagesController {
  @Get('index')
  @Render('pages/index')
  index(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('shop')
  @Render('pages/shop')
  shop(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('cart')
  @Render('pages/cart')
  cart(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('brand')
  @Render('pages/brand')
  brand(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('category')
  @Render('pages/category')
  category(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('list')
  @Render('pages/list')
  list(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('login')
  @Render('pages/login')
  loginPage(@Query('user') user?: string) {
    return { user: user ?? null };
  }

  @Get('signin')
  @Render('pages/signin')
  signin(@Query('user') user?: string) {
    return { user: user ?? null };
  }
}