import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document } from 'mongoose';

@Schema()
export class Admin extends Document {
  // @Prop({ required: true })
  // id: string;

  @Prop({ required: true })
  roleId: string; // ID of the role this admin belongs to
  
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

