import {Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards,} from '@nestjs/common';
  import { ModulesService } from './modules.services';
  import { CreateModuleDto } from './dto/create.modules.dto';
  import { UpdateModuleDto } from './dto/update.modules.dto';
  import { DeleteModuleDto } from './dto/delete.modules.dto';
  import { Role, Roles } from '../auth/decorators/roles.decorator';
  import { Public } from '../auth/decorators/public.decorator';
  import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
  import { AuthGuard } from '../auth/guards/authentication.guard';
  
  @Controller('modules')
  @UseGuards(AuthGuard) // Applies authentication to all routes by default
  @UseGuards(AuthorizationGuard)
  export class ModulesController {
    constructor(private readonly modulesService: ModulesService) {}
  
    // 1. Add a Module to a Course
    @Post()
    @Roles(Role.Instructor) // Only instructors can add modules
    @HttpCode(HttpStatus.CREATED)
    async addModule(@Body() createModuleDto: CreateModuleDto) {
      return this.modulesService.addModule(createModuleDto);
    }
  
    // 2. Update a Module
    @Put()
    @Roles(Role.Instructor, Role.Admin) // Both instructors and admins can update modules
    @HttpCode(HttpStatus.OK)
    async updateModule(
      @Body() updateModuleDto: UpdateModuleDto) {
      return this.modulesService.updateModule(updateModuleDto);
    }
  
    // 3. Delete a Module
    @Delete()
    @Roles(Role.Admin,Role.Instructor) // Both instructors and admins can delete modules
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteModule( @Body() deleteModuleDto: DeleteModuleDto,) {
      await this.modulesService.deleteModule(deleteModuleDto);
    }
  
    // 4. Fetch All Modules
    @Get('/:courseId')
    @Roles(Role.Admin,Role.Instructor) // Only instructors and admins can view all modules
    @HttpCode(HttpStatus.OK)
    async fetchModules(@Param('courseId') courseId: string) {
      return this.modulesService.fetchModules(courseId);
    }
  
    // 5. Fetch Non-Outdated Resources (accessible to students, instructors, and admins)
    @Get()
    @Public()
    @HttpCode(HttpStatus.OK)
    async fetchNonOutdatedResources(@Param('moduleId') moduleId: string) {
      return this.modulesService.fetchNonOutdatedResources(moduleId);
    }
    // Fetch All Resources By Module ID (accessible to instructors and admins)
@Get('/resources/:moduleId')
@Roles(Role.Admin, Role.Instructor) // Only instructors and admins can view all resources
@HttpCode(HttpStatus.OK)
async fetchAllResourcesByModuleId(@Param('moduleId') moduleId: string) {
  return this.modulesService.fetchAllResourcesByModuleId(moduleId);
}

// Fetch Non-Outdated Resources By Module ID (accessible to students, instructors, and admins)
@Get('/resources/non-outdated/:moduleId')
@Public()
@HttpCode(HttpStatus.OK)
async fetchNonOutdatedResourcesByModuleId(@Param('moduleId') moduleId: string) {
  return this.modulesService.fetchNonOutdatedResourcesByModuleId(moduleId);
}

  }
  