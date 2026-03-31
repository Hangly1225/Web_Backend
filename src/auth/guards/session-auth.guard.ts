import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { IS_PUBLIC_KEY } from '../decorators/public-access.decorator';
  import { SessionRequest } from '../../types/session';
  
  @Injectable()
  export class SessionAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(), 
        context.getClass(),
      ]);
  
      if (isPublic) {
        return true;
      }
  
      if (context.getType() !== 'http') {
        return true;
      }
  
      const request = context.switchToHttp().getRequest<SessionRequest>();
      if (request.path.startsWith('/api/graphql')) {
        return true;
      }
      const isApiRequest = request.path.startsWith('/api/');
      if (!isApiRequest) {
        return true;
      }
  
      if (!request.session?.user) {
        throw new UnauthorizedException('Authentication required');
      }
  
      return true;
    }
  }