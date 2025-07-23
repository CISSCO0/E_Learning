import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.services';
import { CreateResourceDto } from './dto/create.resource.dto';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { resource } from './models/resourse.schema';


@Controller('resources')
 @UseGuards(AuthGuard)
 @UseGuards(AuthorizationGuard)//done  testes wait for creating logs 
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post(':moduleId')
  @Public()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // Use absolute path for better reliability
      destination: './uploads', // Adjust this path if needed
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    }),

  }))
  async addResource(
    @Param('moduleId') moduleId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    console.log('Received request to add resource to module:', moduleId);
    console.log('Uploaded file details:', file);
    console.log('Resource DTO:', createResourceDto);
  
    if (!file) {
      throw new BadRequestException('File is missing');
    }
  
    return await this.resourcesService.addResource(
      moduleId,
      createResourceDto,
      file.filename,
      file.path,
    );
  }
  

  @Put(':resourceId/outdated')
  async updateOutdatedFlag(
    @Param('resourceId') resourceId: string,
    @Body() body: { outdated: boolean } // Accepts the 'flag' in the request body
  ) {
   // console.log(body.outdated);
    return await this.resourcesService.updateResourceOutdatedFlag(resourceId, body.outdated);
  }
  
  @Get(':moduleId/non-outdated')
@Public()
async fetchNonOutdatedResources(@Param('moduleId') moduleId: string) {
  return this.resourcesService.fetchNonOutdatedResources(moduleId);
}
    // Fetch All Resources By Module ID (accessible to instructors and admins)
    @Get(':moduleId')//tested 
   @Roles(Role.Admin, Role.Instructor) // Only instructors and admins can view all resources
   //@HttpCode(HttpStatus.OK)
    async fetchAllResourcesByModuleId(@Param('moduleId') moduleId: string) {
      return this.resourcesService.fetchAllResourcesByModuleId(moduleId);
    }
  
  @Get(':moduleId/with-download-links')
  @Public()
  async fetchAllResourcesWithDownloadLinks(@Param('moduleId') moduleId: string) {
    console.log(await this.resourcesService.fetchAllResourcesWithDownloadLinks(moduleId));
    return await this.resourcesService.fetchAllResourcesWithDownloadLinks(moduleId);
  }
  @Public()
  @Get('download/:fileName')
  //@Public()
  async downloadResource(@Param('fileName') fileName: string, @Res() res: any) {
    return this.resourcesService.downloadResource(fileName, res);
  }
//done
@Public()
@Get()
async ok() {
  return this.resourcesService.ok();
}
  @Delete(':moduleId/:resourceId')
 @Roles(Role.Admin, Role.Instructor)
  async deleteResource(
    @Param('moduleId') moduleId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.resourcesService.deleteResource(moduleId, resourceId);
  }
}