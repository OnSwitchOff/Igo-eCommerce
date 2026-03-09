import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";

@Injectable()
export class ScopesGuard implements CanActivate {

    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {

        const requiredScopes = this.reflector.getAllAndOverride<string[]>(
            'scopes',
            [context.getHandler(), context.getClass()],
        );

        if (!requiredScopes) return true;

        const {user} = context.switchToHttp().getRequest();

        return requiredScopes.some(scope =>
            user.scopes?.includes(scope),
        );
    }
}