import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ModuleProgressService } from './moduleProgress.service';
import { ModuleProgress } from './models/moduleProgress.schema';
import { Roles, Role } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.gaurd';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('module-progress')

export class ModuleProgressController {
  constructor(private readonly moduleProgressService: ModuleProgressService) {}

  // Get progress by user ID
  @Get('user/:userId')
  @Roles(Role.Student,Role.Instructor,Role.Admin)
  async getProgressByUser(@Param('userId') userId: string): Promise<any[]> {
    return await this.moduleProgressService.getProgressByUser(userId);
  }

  // Get progress by module ID
  @Get('module/:moduleId')
  @Roles(Role.Student,Role.Instructor,Role.Admin)
  async getProgressByModule(@Param('moduleId') moduleId: string): Promise<any[]> {
    return await this.moduleProgressService.getProgressByModule(moduleId);
  }

  // Create a progress entry
  @Post()
  @Roles(Role.Student)
  async createProgress(
    @Body() body: { user_id: string; module_id: string },
  ): Promise<ModuleProgress> {
    const { user_id, module_id } = body;
    return await this.moduleProgressService.createProgress(user_id, module_id);
  }

  // Delete a progress entry
  @Delete()
  @Roles(Role.Instructor,Role.Admin)
  async deleteProgress(
    @Query('userId') userId: string,
    @Query('moduleId') moduleId: string,
  ): Promise<void> {
    return await this.moduleProgressService.deleteProgress(userId, moduleId);
  }

}
