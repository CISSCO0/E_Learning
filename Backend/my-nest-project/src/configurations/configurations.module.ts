import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigurationsController } from './configurations.controller';
import { ConfigurationsService } from './configurations.service';
import { Configuration, ConfigurationSchema } from './models/configurations.schema';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Configuration.name, schema: ConfigurationSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Ensure JWT_SECRET is in your .env file
      signOptions: { expiresIn: '60s' },  // Adjust expiration as needed
    }),
  ],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
})
export class ConfigurationsModule {}
