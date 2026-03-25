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
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { 
  ApiBody, 
  ApiOkResponse, 
  ApiOperation, 
  ApiTags, 
  ApiCookieAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PublicAccess } from './decorators/public-access.decorator';
import { SessionRequest } from '../types/session';
import { UserRole } from './decorators/roles.decorator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

class LoginDto {
  @ApiProperty({ example: 'demo-user', description: 'Username or email' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'secret123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

class SigninDto extends LoginDto {
  @ApiProperty({ example: 'demo@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientRustPanicError
    ) {
      throw new ServiceUnavailableException('Database temporarily unavailable');
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new InternalServerErrorException('Database request failed');
    }

    throw error;
  }

  private resolveRole(username: string): UserRole {
    return username.toLowerCase().includes('admin') ? 'admin' : 'user';
  }

  private async validateCredentials(loginId: string, password: string) {
    const normalizedLoginId = loginId.trim(); 
    const normalizedPassword = password.trim();

    let user: { id: number; username: string; email: string; password: string } | null;
    try {
      user = await this.prisma.user.findFirst({
        where: {
          OR: [{ username: normalizedLoginId }, { email: normalizedLoginId }],
        },
        select: { id: true, username: true, email: true, password: true },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }

    if (!user || user.password !== normalizedPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  private async createUserAccount(dto: SigninDto) {
    const normalizedUsername = dto.username.trim();
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedPassword = dto.password.trim();

    if (!normalizedUsername || !normalizedEmail || !normalizedPassword) {
      throw new BadRequestException('Username, email and password are required');
    }

    let existingUser: { username: string; email: string } | null;
    try {
      existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ username: normalizedUsername }, { email: normalizedEmail }],
        },
        select: {
          username: true,
          email: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    try {
      return await this.prisma.user.create({
        data: {
          username: normalizedUsername,
          email: normalizedEmail,
          password: normalizedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  @PublicAccess()
  @Post('login')
  @ApiOperation({ summary: 'Login with username/email and password' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() body: LoginDto,
    @Req() req: SessionRequest,
    @Res() res: Response,
  ) {
    const user = await this.validateCredentials(body.username, body.password);
    req.session.user = user.username;
    req.session.role = this.resolveRole(user.username);
    return res.redirect('/');
  }

  @PublicAccess()
  @Post('api/auth/login')
  @ApiOperation({ summary: 'Login via API' })
  @ApiBody({ type: LoginDto })
  async apiLogin(@Body() body: LoginDto, @Req() req: SessionRequest) {
    const user = await this.validateCredentials(body.username, body.password);
    const role = this.resolveRole(user.username);

    req.session.user = user.username;
    req.session.role = role;

    return { authenticated: true, user: user.username, role, email: user.email };
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
      message: `Welcome ${req.session.user}`,
      role: req.session.role ?? 'user',
    };
  }
}