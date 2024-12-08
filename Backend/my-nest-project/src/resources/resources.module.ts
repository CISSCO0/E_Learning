import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesController } from './resources.controllers';
import { ResourcesService } from './resources.services';
import { resource, ResourceSchema } from './models/resourse.schema';
import { Modules } from '../modules/models/modules.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ModulesModule } from 'src/modules/modules.module';
import { MulterModule } from '@nestjs/platform-express';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: resource.name, schema: ResourceSchema },
      { name: Modules.name, schema:  Modules  },
    ]),
    MulterModule.register({
      dest: './uploads', // Destination for file storage
      limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
      },
    }),
    AuthModule,
    ModulesModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}

