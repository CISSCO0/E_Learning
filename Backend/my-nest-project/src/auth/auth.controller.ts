import { Body, Controller, HttpStatus, Post, HttpException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { RegisterAdminDto } from './dto/RegisterAdminDto';
import { RegisterInstructorDto } from './dto/RegisterInstructorDto';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { SignInDto } from './dto/SignInDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) res) {
    try {
      const result = await this.authService.signIn(signInDto.email, signInDto.password);

      res.cookie('token', result.access_token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600 * 1000, // Cookie expiration time in milliseconds
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        user: result.payload,
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

      switch (registerDto.role_id) {
        case 1: // Admin
          result = await this.authService.registerAdmin(user, registerDto as RegisterAdminDto);
          break;
        case 2: // Instructor
          result = await this.authService.registerInstructor(user, registerDto as RegisterInstructorDto);
          break;
        case 3: // Student
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
