import { Controller, Get, Post,UseGuards, Put, Delete, Param, Body, Query, UnauthorizedException, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTo } from './dto/createUser.dto'; 
import { updateUserDTo } from './dto/updateUser.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard'; 
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Public } from 'src/auth/decorators/public.decorator';
// ======================================================================
  @UseGuards(AuthGuard, AuthorizationGuard)
  @Controller('users')
  export class UserController {
  constructor(private readonly userService: UserService) {}
// ======================================================================
  @Roles(Role.Admin)
  @Post()
  async createUser(@Body() dto: createUserDTo) {
    return this.userService.createUser(dto);
  }
// ======================================================================
  @Roles(Role.Admin)
  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
// ======================================================================
  @Roles(Role.Admin, Role.Instructor,Role.Student)
  @Get('search')
  async searchByName(
    @Query('name') name: string,
    @Req() req: Request
     // Pass the requesting user's ID
  ): Promise<any> {
    // Fetch the user making the request to determine their role
    const token = this.extractToken(req);
        
        if (!token) {
          throw new UnauthorizedException('Authentication token is required');
        }
    
        // Decode token to get userId
        let decodedToken: any;
        try {
          decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
        } catch (err) {
          throw new UnauthorizedException('Invalid or expired token');
        }
       //console.log('wooo: ', decodedToken);
        const role = decodedToken.role; // Assuming 'id' is the field in your JWT payload
        const targetRole = role === 'instructor' ? 'student' : 'instructor';
        const results = await this.userService.searchByNameAndRole(name, targetRole);
      
        return results
  }
// ======================================================================
@Public()
  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    return this.userService.getUserById(userId);
  }
// ======================================================================
  @Roles(Role.Admin,Role.Student)
  @Put(':id')
  async updateUser(@Param('id') userId: string, @Body() dto: updateUserDTo) {
    return this.userService.updateUser(userId, dto);
  }
// ======================================================================
  @Roles(Role.Admin,Role.Instructor,Role.Student)
  @Delete()
  async deleteUser(@Req() req: Request) {
    const token = this.extractToken(req);
        
        if (!token) {
          throw new UnauthorizedException('Authentication token is required');
        }
    
        // Decode token to get userId
        let decodedToken: any;
        try {
          decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
        } catch (err) {
          throw new UnauthorizedException('Invalid or expired token');
        }
       //console.log('wooo: ', decodedToken);
        const userId = decodedToken.userid; // Assuming 'id' is the field in your JWT payload
        console.log(userId)
    return this.userService.deleteUser(userId);
  }
// ======================================================================
  @Roles(Role.Admin,Role.Instructor,Role.Student )
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
// ======================================================================

/**
   * Extracts the token from cookies or Authorization header
   * @param request - The incoming HTTP request
   * @returns The JWT token if present
   */
  private extractToken(request: Request): string | undefined {
    // Check cookies for the token
    if (request.cookies && request.cookies.token) {
      return request.cookies.token;
    }

    // Check Authorization header for the token
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    return undefined;
  }

}
