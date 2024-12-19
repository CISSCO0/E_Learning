import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Step 1: Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Step 2: Extract the token (from cookies or headers)
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided, please login');
    }

    try {
      // Step 3: Verify the token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Step 4: Attach the payload to the request object for further use
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  /**
   * Extracts the token from cookies or Authorization header
   * @param request - The incoming HTTP request
   * @returns The JWT token if present
   */
  private extractToken(request: Request): string | undefined {
    // Check cookies for the token
    //console.log(request.cookies);
    if (request.cookies && request.cookies.token) {
      console.log('Token extracted from cookies:', request.cookies.token);
      return request.cookies.token;
    }

    // Check Authorization header for the token
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      console.log('Token extracted from Authorization header:', token);
      return token;
    }

    console.log('No token found in cookies or Authorization header');
    return undefined;
  }
}
