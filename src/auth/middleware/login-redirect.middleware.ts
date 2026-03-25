import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { SessionRequest } from '../../types/session';

@Injectable()
export class LoginRedirectMiddleware implements NestMiddleware {
  use(req: SessionRequest, res: Response, next: NextFunction) {
    if (req.session?.user) {
      return next();
    }

    return res.redirect('/login');
  }
}