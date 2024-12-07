import { Body, Controller, HttpStatus, Post, HttpException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { RegisterAdminDto } from './dto/RegisterAdminDto';
import { RegisterInstructorDto } from './dto/RegisterInstructorDto';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { SignInDto } from './dto/SignInDto';
import { Response } from 'express'; // Make sure you import this
import { JwtService } from '@nestjs/jwt';  // Import the JwtService

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res: Response) {
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.password);
  
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
  
      // Set JWT token in a cookie
      res.cookie('token', await this.jwtService.signAsync(payload), {
        httpOnly: true,   // Ensures the cookie can't be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        maxAge: 3600 * 1000, // 1 hour
      });
  
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
  @Post('register')
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
