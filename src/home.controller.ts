import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class HomeController {

  @Get()
  @Render('home')
  root() {
    return { name: 'Hangly' };
  }

}
