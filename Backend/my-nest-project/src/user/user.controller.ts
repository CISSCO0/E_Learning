import { Controller, Get, Post,UseGuards, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTo } from './dto/createUser.dto'; 
import { updateUserDTo } from './dto/updateUser.dto';
import { AuthGuard } from 'src/auth/guards/authentication.guard'; 
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';

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
  @Roles(Role.Admin, Role.Instructor)
  @Get('search')
  async searchByName(@Query('name') name: string){
  await this.userService.searchByName(name);
  return {message: 'You got it'}; 
  }
// ======================================================================
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
// ======================================================================
  @Roles(Role.Admin,Role.Instructor,Role.Student )
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
// ======================================================================


}
