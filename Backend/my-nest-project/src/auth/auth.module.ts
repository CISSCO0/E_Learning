import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { StudentModule } from 'src/student/student.module'; // Assuming StudentModule exists
import { AdminModule } from 'src/admin/admin.module'; // Assuming AdminModule exists
import { InstructorModule } from 'src/instructor/instructor.module'; // Assuming InstructorModule exists
import { UserModule } from 'src/user/user.module';  // Assuming UserModule exists (for common user services)

@Module({
  imports: [
    // Import the relevant modules for the different roles
    StudentModule,
    AdminModule,
    InstructorModule,
    UserModule,  // If there's a general user module for shared logic
    JwtModule.register({
      global: true,  // Makes the JWT configuration globally available across modules
      secret: process.env.JWT_SECRET || 'defaultSecret',  // Set default secret key (use env variable in production)
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }, // Token expiration time (default: 1 hour)
    }),
  ],
  controllers: [AuthController],  // Handle the incoming HTTP requests
  providers: [AuthService],  // Service that contains the business logic
  exports: [JwtModule]
})
export class AuthModule {}
