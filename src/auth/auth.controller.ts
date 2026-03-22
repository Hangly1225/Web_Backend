import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface SessionRequest extends Request {
  body: {
    username?: string;
    password?: string;
  };
  session: {
    user?: string;
    destroy: (callback: () => void) => void;
  };
}

@Controller()
export class AuthController {
  @Post('login')
  login(@Req() req: SessionRequest, @Res() res: Response) {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }
    req.session.user = username;
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req: SessionRequest, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
  
  @Get('profile')
  profile(@Req() req: SessionRequest) {
    if (!req.session.user) {
      return { message: 'Please login' };
    }

    return { message: `Welcome ${req.session.user}` };
  }
}
