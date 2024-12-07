import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesService } from './modules.services';
import { ModulesController } from './modules.controllers';
import { Modules, ModulesSchema } from './models/modules.schema';
import { resource, ResourceSchema } from '../resources/models/resourse.schema';
// import { AuthorizationGuard } from '../auth/guards/authorization.gaurd';
// import { AuthGuard } from '../auth/guards/authentication.guard';

@Module({
  imports: [
    // Import Mongoose schemas for both Modules and Resources
    MongooseModule.forFeature([
      { name: Modules.name, schema: ModulesSchema },
      { name: resource.name, schema: ResourceSchema },
    ]),
  ],
  controllers: [ModulesController], // Add the controller
  providers: [ModulesService, ],//AuthGuard, AuthorizationGuard], // Add services and guards
  exports: [ModulesService], // Export service for other modules if needed
})
export class ModulesModule {}
