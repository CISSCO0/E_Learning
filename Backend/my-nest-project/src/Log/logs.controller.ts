import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Log } from './models/logs.schema';
// Comment out these imports to bypass authentication temporarily
 import { AuthGuard } from '../auth/guards/authentication.guard';
 import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
 import { Roles } from '../auth/decorators/roles.decorator';
 import { Role } from '../auth/decorators/roles.decorator';

@Controller('logs')

 @UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin) // Restrict to Admin role
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto) {
    try {
      return await this.logsService.create(createLogDto);
    } catch (error) {
      throw new BadRequestException('Failed to create log', error.message);
    }
  }

  @Get()
 @Roles(Role.Admin) // Only admins can view all logs
  async findAll(
    @Query('page') page: string = '1',  // default to 1
    @Query('limit') limit: string = '10' // default to 10
  ) {
    // Convert to integer to ensure correct type
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
  
    // Validate the page and limit to be valid numbers
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be valid numbers');
    }
  
    try {
      // Pass the parsed pageNumber and limitNumber to the service
      return await this.logsService.findAll(pageNumber, limitNumber);
    } catch (error) {
      throw new BadRequestException('Failed to retrieve logs', error.message);
    }
  }
  

  @Get(':id')
  @Roles(Role.Admin) // Only admins can view a specific log by ID
  async findOne(@Param('id') id: string) {
    try {
      return await this.logsService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Log with ID ${id} not found`, error.message);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    if (id !== updateLogDto.id) {
      throw new BadRequestException('Log ID in the URL and body must match');
    }
    try {
      return await this.logsService.update(id, updateLogDto);
    } catch (error) {
      throw new BadRequestException('Failed to update log', error.message);
    }
  }

  @Delete(':id')
  @Roles(Role.Admin) // Restrict to Admin role
  async remove(@Param('id') id: string) {
    try {
      return await this.logsService.remove(id);
    } catch (error) {
      throw new NotFoundException(`Log with ID ${id} not found`, error.message);
    }
  }

  /*@Get('search')
  async searchLogs(@Query('key') key: string): Promise<Log[]> {
    // Validate the query parameter
    if (!key || key.trim() === '') {
      throw new BadRequestException('The "key" query parameter is required and cannot be empty.');
    }
  
    try {
      // Call the service method
      const results = await this.logsService.searchByKey(key);
  
      // Log the search operation for debugging
      console.log(`Search performed with key: ${key}, found ${results.length} logs`);
  
      return results;
    } catch (error) {
      // Handle specific exceptions or fallback to a generic one
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException if no logs match
      }
      console.error('Search failed:', error);
      throw new BadRequestException('An error occurred while searching logs', error.message);
    }
  }
  */
}

