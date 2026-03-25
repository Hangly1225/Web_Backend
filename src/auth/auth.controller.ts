import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { 
  ApiBody, 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags, 
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PublicAccess } from './decorators/public-access.decorator';
import { SessionRequest } from '../types/session';
import { UserRole } from './decorators/roles.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  private resolveRole(username: string): UserRole {
    return username.toLowerCase().includes('admin') ? 'admin' : 'user';
  }

  private async validateCredentials(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  @PublicAccess()
  @Post('login')
  @ApiOperation({ summary: 'Create a session by username/password' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() body: LoginDto,
    @Req() req: SessionRequest,
    @Res() res: Response,
  ) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const user = await this.validateCredentials(username, password);
    req.session.user = user.username;
    req.session.role = this.resolveRole(username);
    return res.redirect('/');
  }

  @PublicAccess()
  @Post('api/auth/login')
  @ApiOperation({ summary: 'Create an API session and return current principal' })
  @ApiBody({ type: LoginDto })
  async apiLogin(@Body() body: LoginDto, @Req() req: SessionRequest) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const user = await this.validateCredentials(username, password);
    const role = this.resolveRole(user.username);
    req.session.user = user.username;
    req.session.role = role;

    return { authenticated: true, user: user.username, role };
  }

  @ApiCookieAuth('session-cookie')
  @Post('api/auth/logout')
  @ApiOperation({ summary: 'Destroy API session' })
  apiLogout(@Req() req: SessionRequest) {
    req.session.destroy(() => undefined);
    return { authenticated: false };
  }

  @Get('logout')
  logout(@Req() req: SessionRequest, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  }

  @ApiCookieAuth('session-cookie')
  @Get('api/auth/me')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        authenticated: { type: 'boolean' },
        user: { type: 'string', nullable: true },
        role: { type: 'string', nullable: true },
      },
    },
  })
  me(@Req() req: SessionRequest) {
    return {
      authenticated: Boolean(req.session.user),
      user: req.session.user ?? null,
      role: req.session.role ?? null,
    };
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
      message: 'Welcome ${req.session.user}',
      role: req.session.role ?? 'user',
    };
  }
}
