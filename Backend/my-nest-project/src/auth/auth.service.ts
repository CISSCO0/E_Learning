// import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { UserService } from 'src/user/user.service';
// import { AdminService } from 'src/admin/admin.service';
// import { InstructorService } from 'src/instructor/instructor.service';
// import { StudentService } from 'src/student/student.service';
// import { RegisterRequestDto } from './dto/RegisterRequestDto';
// import { RegisterAdminDto } from './dto/RegisterAdminDto';
// import { RegisterInstructorDto } from './dto/RegisterInstructorDto';
// import { RegisterStudentDto } from './dto/RegisterStudentDto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private adminService: AdminService,
//     private instructorService: InstructorService,
//     private studentService: StudentService,
//     private jwtService: JwtService,
//   ) {}

//   // Register User (Basic Registration)
//   async registerUser(registerDto: RegisterRequestDto): Promise<any> {
//     const existingUser = await this.userService.findByEmail(registerDto.email);
//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(registerDto.password, 10);
//     const newUser = { ...registerDto, password: hashedPassword };

<<<<<<< HEAD
//     return this.userService.create(newUser); // Create the user in the database
//   }

//   // Register Admin (after user creation)
//   async registerAdmin(user: any, registerDto: RegisterAdminDto): Promise<any> {
//     await this.adminService.createAdmin(user._id); // Create admin-specific entity
//     return { user, role: 'admin' };
//   }

//   // Register Instructor (after user creation)
//   async registerInstructor(user: any, registerDto: RegisterInstructorDto): Promise<any> {
//     await this.instructorService.createInstructor(user._id, registerDto); // Create instructor-specific entity
//     return { user, role: 'instructor' };
//   }

//   // Register Student (after user creation)
//   async registerStudent(user: any, registerDto: RegisterStudentDto): Promise<any> {
//     await this.studentService.createStudent(user._id, registerDto); // Create student-specific entity
//     return { user, role: 'student' };
//   }

//   // SignIn (Login)
//   async signIn(email: string, password: string): Promise<{ access_token: string, payload: any }> {
//     const user = await this.userService.findByEmail(email);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const payload = { userid: user._id, role: user.role };
//     const access_token = await this.jwtService.signAsync(payload);

=======
    return this.userService.createUser(newUser); // Create the user in the database
  }


//   // Register Admin (after user creation)
//   async registerAdmin(user: any, registerDto: RegisterAdminDto): Promise<any> {
//     await this.adminService.createAdmin(user._id); // Create admin-specific entity
//     return { user, role: 'admin' };
//   }

//   // Register Instructor (after user creation)
//   async registerInstructor(user: any, registerDto: RegisterInstructorDto): Promise<any> {
//     await this.instructorService.createInstructor(user._id, registerDto); // Create instructor-specific entity
//     return { user, role: 'instructor' };
//   }

//   // Register Student (after user creation)
//   async registerStudent(user: any, registerDto: RegisterStudentDto): Promise<any> {
//     await this.studentService.createStudent(user._id, registerDto); // Create student-specific entity
//     return { user, role: 'student' };
//   }

//   // SignIn (Login)
//   async signIn(email: string, password: string): Promise<{ access_token: string, payload: any }> {
//     const user = await this.userService.findByEmail(email);
//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const payload = { userid: user._id, role: user.role };
//     const access_token = await this.jwtService.signAsync(payload);

>>>>>>> 55579753292db4e666c3d655dee4f464d8d7379c
//     return { access_token, payload };
//   }
// }
