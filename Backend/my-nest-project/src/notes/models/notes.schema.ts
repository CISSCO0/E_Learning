import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notes extends Document {
  @Prop({ required: true })
  title: string; // Title of the note (new field)
  
  @Prop({ required: true })
  user_id: string; // User who created the note

  @Prop({ required: true })
  course_id: string; // Course to which the note is associated

  @Prop({ required: true })
  content: string; // Content of the note

  @Prop({ required: true, type: Date })
  created_at: Date; // Date when the note was created

  @Prop({ required: true, type: Date })
  last_updated: Date; // Date when the note was last updated

  @Prop({ default: false })
  isFavorite: boolean; // Marks if the note is a favorite

  @Prop({ type: [String], default: [] })
  sharedWith: string[]; // Array of user IDs the note is shared with
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
