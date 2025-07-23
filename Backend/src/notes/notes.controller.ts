import { 
  Controller, Get, Post, Put, Delete, Param, Body, Req, Query, 
  UseGuards
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.gaurd'; // Match the filename

import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.decorator';

  @UseGuards(AuthGuard, AuthorizationGuard) // Uncomment when adding authentication/authorization
  @Controller('notes')
  export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @Roles(Role.Admin, Role.Instructor) // Uncomment when adding role-based access control
  async findAll(@Query('courseId') courseId: string) {
    if (courseId) {
      return this.notesService.findByCourse(courseId);
    }
    return this.notesService.findAll();
  } 

  /*@Get('search')
  async searchNotes(@Query('keyword') keyword: string, @Req() req: any) {
    // const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    // return this.notesService.searchNotes(keyword, userId); // Uncomment when JWT authentication is enabled
    return this.notesService.searchNotes(keyword, 'testUserId'); // Mocked userId for testing
  }*/
  @Get('search')
  async searchByTitle(@Query('title') title: string) {
  if (!title || typeof title !== 'string') {
    throw new Error('Title query parameter must be a non-empty string');
  }
  return this.notesService.findByTitle(title);
}

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Req() req: any) {
     const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    createNoteDto.user_id = userId; // Uncomment when JWT authentication is enabled
    createNoteDto.user_id = 'testUserId'; // Mocked userId for testing
    return this.notesService.create(createNoteDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Req() req: any) {
    const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    await this.notesService.checkOwnership(id, userId); // Uncomment when JWT authentication is enabled
    await this.notesService.checkOwnership(id, 'testUserId'); // Mocked userId for testing
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // Uncomment when ensuring user authentication
  async remove(@Param('id') id: string, @Req() req: any) {
     const userId = req.user.userId; // Uncomment when JWT authentication is enabled
     const userRoles = req.user.roles; // Uncomment when JWT authentication is enabled
    // Allow admins or the note owner to delete the note
     if (!userRoles.includes('admin')) {
       await this.notesService.checkOwnership(id, userId); // Ensure the user owns the note
     }
    return this.notesService.remove(id); // Proceed with deletion
  }
//.....................................................................................................................
  // Allow users to share their notes with other users by adding user IDs to the sharedWith field of the note.
 /* @Post('share')
  async share(@Body() body: { noteId: string; sharedWith: string[] }, @Req() req: any) {
    // const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    // Ensure the user owns the note
    // await this.notesService.checkOwnership(body.noteId, userId); // Uncomment when JWT authentication is enabled
    await this.notesService.checkOwnership(body.noteId, 'testUserId'); // Mocked userId for testing
    // Proceed with sharing the note
    return this.notesService.shareNote(body.noteId, body.sharedWith, 'testUserId'); // Mocked userId for testing
  }*/
//...........................................................................................................
  // Allow users to export their notes in different formats, such as PDF or JSON.
  @Get('export/:noteId')
  async exportNote(@Param('noteId') noteId: string, @Query('format') format: string, @Req() req: any) {
    // const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    // Ensure the user owns the note
    // await this.notesService.checkOwnership(noteId, userId); // Uncomment when JWT authentication is enabled
    await this.notesService.checkOwnership(noteId, 'testUserId'); // Mocked userId for testing
    // Proceed with exporting the note
    return this.notesService.exportNote(noteId, format);
  }

  @Put('favorite/:noteId')
  async markAsFavorite(@Param('noteId') noteId: string, @Req() req: any) {
    // const userId = req.user.userId; // Uncomment when JWT authentication is enabled
    return this.notesService.markAsFavorite(noteId, 'testUserId'); // Mocked userId for testing
  }
}
