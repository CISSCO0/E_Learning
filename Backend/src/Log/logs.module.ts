import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Log, LogSchema } from './models/logs.schema';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule
import { LoggerService } from '../logger/logger.service'; // Add this

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,   // Provide the JWT secret from .env
      signOptions: { expiresIn: '60s' },  // Adjust expiration time as needed
    }),
  ],
  controllers: [LogsController],  // Register the controller
  providers: [LogsService, LoggerService],// Register the service
  exports: [LoggerService],      
})
export class LogsModule {}
