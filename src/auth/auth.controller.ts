import { Controller, Post, Get, Req } from '@nestjs/common';

@Controller()
export class AuthController {

  @Post('login')
  login(@Req() req) {
    req.session.user = "Hang ly";
    return "Logged in";
  }

  @Get('profile')
  profile(@Req() req) {

    if(!req.session.user){
      return "Please login";
    }

    return "Welcome " + req.session.user;
  }

}
