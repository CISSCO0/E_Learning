import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { StudentService } from 'src/student/student.service';
import { RegisterRequestDto } from './dto/RegisterRequestDto';
import { RegisterAdminDto } from './dto/RegisterAdminDto';
import { RegisterInstructorDto } from './dto/RegisterInstructorDto';
import { RegisterStudentDto } from './dto/RegisterStudentDto';
import { Response } from 'express'; // Import Response from express
import { parse } from 'cookie';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private instructorService: InstructorService,
    private studentService: StudentService,
    private jwtService: JwtService,
  ) {}

  // Register User (Basic Registration)
  async registerUser(registerDto: RegisterRequestDto): Promise<any> {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(registerDto.hash_pass, 10);
    const createtime = new Date();
    const newUser = { ...registerDto, hash_pass: hashedPassword,createtime };
    
    // Create the user with the hashed password
    const user = await this.userService.createUser(newUser);
    return user;
  }
  

  // Register Admin (after user creation)
  async registerAdmin(user: any, registerDto: RegisterAdminDto): Promise<any> {
    // Pass the userId from the user object to the admin creation
    const admin = await this.adminService.createAdmin({ ...registerDto, user_id: user._id });
    return { user, role: 'admin', admin };
  }

  // Register Instructor (after user creation)
  async registerInstructor(user: any, registerDto: RegisterInstructorDto): Promise<any> {
    // Pass the userId from the user object to the instructor creation
    const instructor = await this.instructorService.createInstructor({ ...registerDto, user_id: user._id });
    return { user, role: 'instructor', instructor };
  }

  // Register Student (after user creation)
  async registerStudent(user: any, registerDto: RegisterStudentDto): Promise<any> {
    // Pass the userId from the user object to the student creation
    const student = await this.studentService.createStudent({ ...registerDto, user_id: user._id });
    return { user, role: 'student', student };
  }

  // SignIn (Login)
  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash_pass);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userid: user._id, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token, payload }; // Return token and user info for the controller to set as cookie
  }

 /**
   * Parses cookies from the request header
   * @param cookieHeader - The `cookie` header from the request
   * @returns Parsed cookies object
   */
 getCookies(cookieHeader: string): Record<string, string> {
  if (!cookieHeader) return {};
  return parse(cookieHeader);
}

/**
 * Checks if a specific cookie exists
 * @param cookies - Parsed cookies object
 * @param key - The cookie key to check
 */
checkCookie(cookies: Record<string, string>, key: string): boolean {
  return !!cookies[key];
}
}
