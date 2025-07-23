import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { LoggerService } from '../logger/logger.service';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';

@Controller('logs')
// @UseGuards(AuthGuard, AuthorizationGuard)
// @Roles(Role.Admin) // Restrict to Admin role
export class LogsController {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 10;

  constructor(
    private readonly logsService: LogsService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() createLogDto: CreateLogDto) {
    this.logger.logInfo('Creating a new log');
    try {
      const createdLog = await this.logsService.create(createLogDto);
      this.logger.logInfo(`Log created with ID: ${createdLog._id}`);
      return createdLog;
    } catch (error) {
      this.logger.logError('Failed to create log', error.message);
      throw new BadRequestException('Failed to create log');
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string = `${this.DEFAULT_PAGE}`,
    @Query('limit') limit: string = `${this.DEFAULT_LIMIT}`,
  ) {
    this.logger.logInfo(`Fetching logs with page=${page} and limit=${limit}`);
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('Page and limit must be valid numbers');
    }

    try {
      return await this.logsService.findAll(pageNumber, limitNumber);
    } catch (error) {
      this.logger.logError('Failed to fetch logs', error.message);
      throw new BadRequestException('Failed to retrieve logs');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.logInfo(`Fetching log with ID: ${id}`);
    try {
      return await this.logsService.findOne(id);
    } catch (error) {
      this.logger.logError(`Log not found with ID: ${id}`, error.message);
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLogDto: UpdateLogDto) {
    if (id !== updateLogDto.id) {
      throw new BadRequestException('Log ID in the URL and body must match');
    }
    this.logger.logInfo(`Updating log with ID: ${id}`);
    try {
      return await this.logsService.update(id, updateLogDto);
    } catch (error) {
      this.logger.logError('Failed to update log', error.message);
      throw new BadRequestException('Failed to update log');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.logInfo(`Deleting log with ID: ${id}`);
    try {
      return await this.logsService.remove(id);
    } catch (error) {
      this.logger.logError('Failed to delete log', error.message);
      throw new NotFoundException(`Log with ID ${id} not found`);
    }
  }
}
