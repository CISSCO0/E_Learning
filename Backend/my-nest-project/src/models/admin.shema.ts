import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Admin {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  roleId: string; // ID of the role this admin belongs to
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string; // Store hashed password for security

  @Prop({ default: [] })
  permissions: string[]; // List of permissions (e.g., "manage-users", "view-logs")

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminDocument = HydratedDocument<Admin>;
