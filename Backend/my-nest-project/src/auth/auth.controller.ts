import { Body, Controller, HttpStatus, Post, HttpException, Res, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { RegisterAdminDto } from './dto/RegisterAdminDto';
import { RegisterInstructorDto } from './dto/RegisterInstructorDto';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { SignInDto } from './dto/SignInDto';
import { Response } from 'express'; // Make sure you import this
import { JwtService } from '@nestjs/jwt';  // Import the JwtService
import { AuthGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.gaurd';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';
import { Request } from 'express';
import * as dotenv from 'dotenv';

import * as jwt from 'jsonwebtoken';
@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

 
  @Get('check-token')
  @Public()
  async checkToken(@Req() req: Request, @Res() res: Response) {
    try {
      // Step 1: Parse cookies from the request
      const cookies = this.authService.getCookies(req.headers.cookie || '');

      // Step 2: Check if the token cookie exists
      if (this.authService.checkCookie(cookies, 'token')) {
        const token = cookies['token'];

        // Optionally verify the token (if you want to decode it or ensure validity)
        const decoded = await this.jwtService.verifyAsync(token);

        return res.status(HttpStatus.OK).json({
          message: 'Token is valid',
          token,
          decoded, // Optional: Return the decoded payload for reference
        });
      }

      // If no token is found
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No token found',
      });
    } catch (error) {
      // Handle invalid or expired tokens
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid or expired token',
        error: error.message,
      });
    }
  }
  @Post('login')
  @Public()
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    dotenv.config();
    
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.hash_pass);
      
      //console.log(result.payload);
      // Role mapping logic
      let role: string;
      switch (result.payload.role) {
        case '1':
          role = 'admin';
          break;
        case '2':
          role = 'instructor';
          break;
        case '3':
          role = 'student';
          break;
        default:
          role = 'guest'; // Or handle the case when role is not recognized
      }

      // Now, include the mapped role in the payload for the JWT
      const payload = { userid: result.payload.userid, role: role };

      const token = await this.jwtService.signAsync(payload);
      //console.log(token);
      // Set the JWT token as a cookie
      res.cookie('token', token, {
        httpOnly: true, // Prevents client-side access to the cookie
        secure: false,  // Set to true for HTTPS
        sameSite: 'lax', // Adjust based on your CORS strategy
      });
      // console.log('Response Headers After Setting Cookie:', res.getHeaders());


      res.setHeader('authorization', `Bearer ${token}`);
     // const cookiesSet = res.getHeaders();
      //console.log('Cookies Set in Response:', cookiesSet);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        user: result.payload, // Return the payload as part of the response
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during login',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    
  }

  // @Post('protected')
  // async protected(@Request() req) {
  //   // Check if cookies are being sent
  //   console.log('Cookies:', req.cookies); // Log cookies to see if 'token' is present

  //   // Access the cookie from the request
  //   const token = req.cookies['token']; // Get the token cookie
  //   if (!token) {
  //     throw new HttpException(
  //       { statusCode: HttpStatus.UNAUTHORIZED, message: 'No token found' },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }

  //   // You can also verify the token here, if needed
  //   const payload = await this.jwtService.verifyAsync(token);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Token is valid',
  //     payload,
  //   };
  // }
 /**
   * Handles user logout by clearing the token cookie
   * @param req - Incoming HTTP request
   * @param res - HTTP response object
   */
 @Post('/logout')
 @Public()
 async logout(@Req() req: Request, @Res() res: Response) {
   const token = this.extractToken(req);

   if (!token) {
     return res.status(400).json({ message: 'No token found' });
   }

   // Clear the token cookie
   res.cookie('token', '', {
     httpOnly: true,
     expires: new Date(0), // Expire immediately
   });

   return res.status(200).json({ message: 'Logout successful' });
 }
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

@Get()
@Public()
async getID( @Req() req: Request){
const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      console.log("no")
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('wooo: ', decodedToken);
    const userId = decodedToken.userid;

  return userId;
}


@Get('/role')
@Public()
async getRole( @Req() req: Request){
const token = this.extractToken(req);
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    // Decode token to get userId
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, 'clown'); // Replace 'your-secret-key' with your JWT secret
    } catch (err) {
      console.log("no")
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('wooo: ', decodedToken);
    const role = decodedToken.role;

  return role;
}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterRequestDto) {
    try {
      // Register as basic user first
      const user = await this.authService.registerUser(registerDto);

      // Assign the specific role after user registration
      let result;
      
      switch (registerDto.role) {
        case '1': // Admin
          result = await this.authService.registerAdmin(user, registerDto as RegisterAdminDto);
          break;
        case '2': // Instructor
          result = await this.authService.registerInstructor(user, registerDto as RegisterInstructorDto);
          break;
        case '3': // Student
          result = await this.authService.registerStudent(user, registerDto as RegisterStudentDto);
          break;
        default:
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid role ID',
            },
            HttpStatus.BAD_REQUEST,
          );
      }

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
      };
    } catch (error) {
      if (error.status === 409) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: 'User already exists',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred during registration',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 
}
