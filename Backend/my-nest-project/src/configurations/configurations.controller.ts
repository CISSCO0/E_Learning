/*import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';
import { ConfigurationsService } from './configurations.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return this.configurationsService.findAll();
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(id);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Post()
  async create(@Body() createConfigDto: CreateConfigurationDto) {
    return this.configurationsService.create(createConfigDto);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigurationDto) {
    return this.configurationsService.update(id, updateConfigDto);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.configurationsService.remove(id);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Get('search')
  async search(@Query('key') key: string) {
    return this.configurationsService.searchByKey(key);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Put('bulk-update')
  async bulkUpdate(@Body() bulkUpdateDto: UpdateConfigurationDto[]) {
    return this.configurationsService.bulkUpdate(bulkUpdateDto);
  }

  @UseGuards(AuthGuard, AuthorizationGuard)
  @Roles(Role.Admin)
  @Get('role-based')
  async getConfigurationsByRole(@Query('role') role: string) {
    if (!role) {
      throw new BadRequestException('Role parameter is required');
    }
    return this.configurationsService.getByRole(role);
  }
}*/
import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
//import { AuthGuard } from '../auth/guards/authentication.guard';
//import { AuthorizationGuard } from '../auth/guards/authorization.guard';
//import { Roles } from '../auth/decorators/roles.decorator';
//import { Role } from '../auth/decorators/roles.decorator';
import { ConfigurationsService } from './configurations.service';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}
//...........................................................................................................
  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Get('search')
  async search(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('Search key is required');
    }
    return this.configurationsService.searchByKey(key);
  }
//.............................................................................................................
  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Get()
  async findAll() {
    return this.configurationsService.findAll();
  }

  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.configurationsService.findOne(id);
  }

  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Post()
  async create(@Body() createConfigDto: CreateConfigurationDto) {
    return this.configurationsService.create(createConfigDto);
  }

 // @UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigurationDto) {
    return this.configurationsService.update(id, updateConfigDto);
  }

  //@UseGuards(AuthGuard, AuthorizationGuard)
 // @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.configurationsService.remove(id);
  }


  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
  @Put('bulk-update')
async bulkUpdate(@Body() bulkUpdateDto: UpdateConfigurationDto[]) {
  console.log(bulkUpdateDto);  // Log the incoming data
  return this.configurationsService.bulkUpdate(bulkUpdateDto);
}

  //@UseGuards(AuthGuard, AuthorizationGuard)
  //@Roles(Role.Admin)
 /* @Get('role-based')
  async getConfigurationsByRole(@Query('role') role: string) {
    if (!role) {
      throw new BadRequestException('Role parameter is required');
    }
    return this.configurationsService.getByRole(role);
  }*/

    @Post('default/:userId')
    async createDefault(@Param('userId') userId: string) {
      return this.configurationsService.createDefaultConfiguration(userId);
    }
}

