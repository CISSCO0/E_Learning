import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if the user has access to the requested endpoint
 * @param roles - List of roles that are allowed to access the route
 * @param req - Express Request Object
 * @param response - Express Response Object
 * @param next - Express Next Function
*  
*/
export const isUserAuthorized = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Get the user object from the request (this would be populated by an AuthGuard or something similar)
    const user = req['user'];

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if the user's role matches any of the allowed roles
    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('User does not have the required role');
    }

    next(); // User is authorized, continue to the next middleware/handler
  };
};
