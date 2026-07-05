import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) throw new ForbiddenException('Not authenticated');

    // user.role may be string or array; normalize to array of lowercase strings
    const userRoles = ([] as string[])
      .concat(user.role || [])
      .map((r: any) => (r || '').toString().toLowerCase());

    const required = roles.map(r => r.toString().toLowerCase());

    const matched = required.some(r => userRoles.includes(r));
    if (!matched) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
