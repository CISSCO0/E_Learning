import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the route handler's metadata
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
   
    // If no roles are required for the route, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the current user from the request object
    const { user } = context.switchToHttp().getRequest();

    // If no user is attached to the request, throw an error
    if (!user) {
      throw new UnauthorizedException('No user attached');
    }

    // Get the user's role
    let userRole: Role;

    switch (user.role) {
      case 'admin':
        userRole = Role.Admin; // Map 1 to 'admin'
        break;
      case 'instructor':
        userRole = Role.Instructor; // Map 2 to 'instructor'
        break;
      case 'student':
        userRole = Role.Student; // Map 3 to 'student'
        break;
      default:
      //  console.log("oh no"); // You can default to any role or throw an error if necessary
        break;
    }
  //  console.log(userRole);
    // If the user's role is not in the list of required roles, throw an UnauthorizedException
    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException('Unauthorized access');
    }

    // If the user has the required role, allow access
    return true;
  }
}
