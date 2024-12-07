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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourcesService } from './resources.services';
import { CreateResourceDto } from './dto/create.resource.dto';
// import { Role, Roles } from '../auth/decorators/roles.decorator';
// import { Public } from '../auth/decorators/public.decorator';
// import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
// import { AuthGuard } from '../auth/guards/authentication.guard';


@Controller('resources')
// @UseGuards(AuthGuard)
// @UseGuards(AuthorizationGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post(':moduleId')
//  @Roles(Role.Admin, Role.Instructor)
  @UseInterceptors(FileInterceptor('file', {storage: diskStorage({destination: './uploads', // Save files in the "uploads" folder
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async addResource(
    @Param('moduleId') moduleId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createResourceDto: CreateResourceDto,
  ) {
    if (!file) {
      throw new Error('File is missing');
    }

    return await this.resourcesService.addResource(
      moduleId,
      createResourceDto,
      file.originalname,
      file.path
    );
  }

  @Post(':resourceId/outdated')
  //@Roles(Role.Admin, Role.Instructor)
  async updateOutdatedFlag(@Param('resourceId') resourceId: string) {
    return await this.resourcesService.updateResourceOutdatedFlag(resourceId);
  }

  @Get(':moduleId/non-outdated')
  //@Public()
  async fetchNonOutdatedResources(@Param('moduleId') moduleId: string) {
    return this.resourcesService.fetchNonOutdatedResources(moduleId);
  }

  @Get(':moduleId/with-download-links')
  //@Public()
  async fetchAllResourcesWithDownloadLinks(@Param('moduleId') moduleId: string) {
    return await this.resourcesService.fetchAllResourcesWithDownloadLinks(moduleId);
  }

  @Get('download/:fileName')
  //@Public()
  async downloadResource(@Param('fileName') fileName: string, @Res() res: any) {
    return this.resourcesService.downloadResource(fileName, res);
  }

  @Delete(':moduleId/:resourceId')
  //@Roles(Role.Admin, Role.Instructor)
  async deleteResource(
    @Param('moduleId') moduleId: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.resourcesService.deleteResource(moduleId, resourceId);
  }
}
