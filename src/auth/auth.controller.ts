import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UnauthorizedException,
  ConflictException,
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
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

class SigninDto extends LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
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

  private async createUserAccount(dto: SigninDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
      select: {
        username: true,
        email: true,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: dto.password,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
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

  @PublicAccess()
  @Post('signin')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiBody({ type: SigninDto })
  async signin(
    @Body() body: SigninDto,
    @Req() req: SessionRequest,
    @Res() res: Response,
  ) {
    const user = await this.createUserAccount(body);

    req.session.user = user.username;
    req.session.role = this.resolveRole(user.username);
    return res.redirect('/');
  }

  @PublicAccess()
  @Post('api/auth/signin')
  @ApiOperation({ summary: 'Register a new account via API' })
  @ApiBody({ type: SigninDto })
  async apiSignin(@Body() body: SigninDto, @Req() req: SessionRequest) {
    const user = await this.createUserAccount(body);
    const role = this.resolveRole(user.username);

    req.session.user = user.username;
    req.session.role = role;

    return { authenticated: true, user: user.username, role, email: user.email };
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
