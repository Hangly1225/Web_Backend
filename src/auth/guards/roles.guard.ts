import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';
  import { SessionRequest } from '../../types/session';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }
  
      if (context.getType() !== 'http') {
        return true;
      }
  
      const request = context.switchToHttp().getRequest<SessionRequest>();
      const role = request.session?.role;
  
      if (!role || !requiredRoles.includes(role)) {
        throw new ForbiddenException('Insufficient role permissions');
      }
  
      return true;
    }
  }