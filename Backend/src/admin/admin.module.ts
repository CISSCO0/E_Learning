import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './models/admin.shema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() =>UserModule),
    forwardRef(() =>AuthModule),
    forwardRef(() =>JwtModule),
  ],
  providers: [AdminService, AuthGuard, AuthorizationGuard],
  controllers: [AdminController],
  exports: [AdminService, MongooseModule],
})
export class AdminModule {}
