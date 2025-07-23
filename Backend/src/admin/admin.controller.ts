import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { createAdminDTo } from './dto/createAdmin.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';


  @UseGuards(AuthGuard, AuthorizationGuard)
  @Controller('admins')
  export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
// ====================================================================== 
  @Roles(Role.Admin)
  @Post()
  async createAdmin(@Body() dto: createAdminDTo) {
      return this.adminService.createAdmin(dto);
  }
// ====================================================================== 
  @Roles(Role.Admin)
  @Get()
  async getAllAdmins() {
      return this.adminService.getAllAdmins();
  }
// ====================================================================== 
  @Roles(Role.Admin)
  @Get(':id')
  async getAdminById(@Param('id') id: string) {
      return this.adminService.getAdminById(id);
  }
// ====================================================================== 
  @Roles(Role.Admin)
  @Put(':id')
  async updateAdmin(@Param('id') id: string, @Body() dto: createAdminDTo) {
      return this.adminService.updateAdmin(id, dto);
  }
// ====================================================================== 
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteAdmin(@Param('id') id: string) {
      return this.adminService.deleteAdmin(id);
  }
// ======================================================================
}
  

