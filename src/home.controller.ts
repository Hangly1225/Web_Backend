import { Controller, Get, Render, Req } from '@nestjs/common';

@Controller()
export class HomeController {

  @Get()
  @Render('home')
  root(@Req() req) {

    if (req.session.user) {
      return {
        user: req.session.user
      };
    }

    return {
      user: null
    };
  }

}