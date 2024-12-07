import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesController } from './resources.controllers';
import { ResourcesService } from './resources.services';
import { resource, ResourceSchema } from './models/resourse.schema';
import { Modules } from '../modules/models/modules.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: resource.name, schema: ResourceSchema },
     // { name: Modules.name, schema: Modules },
    ]),
    AuthModule,  // Import AuthModule here for authentication and guards
    ModulesModule
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}
