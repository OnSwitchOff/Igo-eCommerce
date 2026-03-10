import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    // спробуємо отримати req для REST
    let req = context.switchToHttp()?.getRequest();

    // якщо REST req немає, пробуємо GraphQL
    if (!req) {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    }

    if (!req || !req.user) return false;

    const user = req.user;

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
