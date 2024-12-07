import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes } from './models/notes.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Notes.name) private notesModel: Model<Notes>) {}

  async findAll(): Promise<Notes[]> {
    return this.notesModel.find().exec();
  }

  async findByCourse(courseId: string): Promise<Notes[]> {
    return this.notesModel.find({ course_id: courseId }).exec();
  }

  async searchNotes(keyword: string, userId: string): Promise<Notes[]> {
    return this.notesModel.find({
      user_id: userId,
      title: { $regex: keyword, $options: 'i' }, // Search only by title
    }).exec();
  }
  async findByTitle(title: string): Promise<Notes[]> {
    return this.notesModel.find({ title: { $regex: title, $options: 'i' } }).exec();
  }

  async checkOwnership(noteId: string, userId: string): Promise<void> {
    const note = await this.notesModel.findById(noteId).exec();
    if (!note) throw new NotFoundException('Note not found');
    if (note.user_id !== userId) {
      throw new NotFoundException('You do not own this note');
    }
  }

  async create(createNoteDto: any): Promise<Notes> {
    const newNote = new this.notesModel({
      ...createNoteDto,
      created_at: new Date(),
      last_updated: new Date(),
    });
    return newNote.save();
  }

  async update(id: string, updateNoteDto: any): Promise<Notes> {
    const updatedNote = await this.notesModel
      .findByIdAndUpdate(id, { ...updateNoteDto, last_updated: new Date() }, { new: true })
      .exec();
    if (!updatedNote) throw new NotFoundException('Note not found');
    return updatedNote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.notesModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Note not found');
  }
  //i need to validate if the user exists
  /*async shareNote(noteId: string, sharedWith: string[], userId: string): Promise<Notes> {
    // Validate sharedWith users exist
    const validUsers = await this.userService.findUsersByIds(sharedWith); // Assume userService exists
    const validUserIds = validUsers.map(user => user.id);
  
    return this.notesModel.findByIdAndUpdate(
      noteId,
      { $addToSet: { sharedWith: { $each: validUserIds } } },
      { new: true },
    ).exec();
  }*/
  

  async exportNote(noteId: string, format: string): Promise<any> {
    const note = await this.notesModel.findById(noteId).exec();
    if (!note) throw new NotFoundException('Note not found');

    if (format === 'pdf') {
      // Example PDF export logic
      return { message: 'PDF export not implemented yet', note };
    } else if (format === 'json') {
      return note;
    } else {
      throw new BadRequestException('Unsupported export format');
    }
  }

  async markAsFavorite(noteId: string, userId: string): Promise<Notes> {
    await this.checkOwnership(noteId, userId);
    return this.notesModel.findByIdAndUpdate(noteId, { isFavorite: true }, { new: true }).exec();
  }
}