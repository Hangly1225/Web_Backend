import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PublicAccess } from './decorators/public-access.decorator';
import { SessionRequest } from '../types/session';
import { UserRole } from './decorators/roles.decorator';

class LoginDto {
  username?: string;
  password?: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  @PublicAccess()
  @Post('login')
  @ApiOperation({ summary: 'Create a session by username/password' })
  @ApiBody({ type: LoginDto })
  login(
    @Body() body: LoginDto,
    @Req() req: SessionRequest,
    @Res() res: Response,
  ) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const role: UserRole = username.toLowerCase().includes('admin')
      ? 'admin'
      : 'user';

    req.session.user = username;
    req.session.role = role;
    return res.redirect('/');
  }

  @Get('logout')
  logout(@Req() req: SessionRequest, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }
  
  @Get('profile')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { message: { type: 'string' }, role: { type: 'string' } },
    },
  })
  profile(@Req() req: SessionRequest) {
    if (!req.session.user) {
      return { message: 'Please login', role: null };
    }

    return {
      message: `Welcome ${req.session.user}`,
      role: req.session.role ?? 'user',
    };
  }
}
