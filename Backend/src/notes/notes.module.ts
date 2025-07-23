import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';  // Import JwtModule
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Notes, NotesSchema } from './models/notes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notes.name, schema: NotesSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,  // Use JWT_SECRET from the .env file
      signOptions: { expiresIn: '60s' },  // You can adjust the expiration as needed
    }),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
