import { BadRequestException, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AuthController {
  @Post('login')
  login(@Req() req, @Res() res: Response) {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }
    req.session.user = username;
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
  
  @Get('profile')
  profile(@Req() req) {
    if (!req.session.user) {
      return { message: 'Please login' };
    }

    return { message: `Welcome ${req.session.user}` };
  }

}
