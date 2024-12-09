import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Log, LogSchema } from './models/logs.schema';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,   // Provide the JWT secret from .env
      signOptions: { expiresIn: '60s' },  // Adjust expiration time as needed
    }),
  ],
  controllers: [LogsController],  // Register the controller
  providers: [LogsService],      // Register the service
})
export class LogModule {}
