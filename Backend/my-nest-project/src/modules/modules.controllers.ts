import {Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, UseGuards,} from '@nestjs/common';
  import { ModulesService } from './modules.services';
  import { CreateModuleDto } from './dto/create.modules.dto';
  import { UpdateModuleDto } from './dto/update.modules.dto';
  import { DeleteModuleDto } from './dto/delete.modules.dto';
  import { Role, Roles } from '../auth/decorators/roles.decorator';
  import { Public } from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
  import { AuthGuard } from '../auth/guards/authentication.guard';
  import { Modules } from './models/modules.schema';
  @Controller('modules')
   @UseGuards(AuthGuard) // Applies authentication to all routes by default
   @UseGuards(AuthorizationGuard)
  export class ModulesController {
    constructor(private readonly modulesService: ModulesService) {}
    
    @Get()
  @Public()
    @HttpCode(HttpStatus.OK) // 200: Successfully fetched resources
    async getAllModules(): Promise<Modules[]> {
      return this.modulesService.findAll(); // Call the service to get all modules
    }

    @Get(':id')//done 
    @Public()
    @HttpCode(HttpStatus.OK)
    async getModuleById(@Param('id') moduleId: string): Promise<Modules> {
      return this.modulesService.getModuleById(moduleId);
    }

    // 1. Add a Module to a Course
    @Post()//done
  @Roles(Role.Instructor) // Only instructors can add modules
    @HttpCode(HttpStatus.CREATED)
    async addModule(@Body() createModuleDto: CreateModuleDto) {
      return this.modulesService.addModule(createModuleDto);
    }
    // 2. Update a Module
    @Put()//done
   @Roles(Role.Instructor, Role.Admin) 
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
    @Get('course/:courseId')//done 
   @Roles(Role.Admin,Role.Instructor) // Only instructors and admins can view all modules
    @HttpCode(HttpStatus.OK)
    async fetchModules(@Param('courseId') courseId: string) {
      return this.modulesService.fetchModules(courseId);
    }
  

  }
  