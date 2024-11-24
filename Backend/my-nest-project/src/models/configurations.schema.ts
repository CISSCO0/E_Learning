import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Configuration extends Document {
  @Prop({ type: Map, of: String })
  settings: Map<string, string>;

  @Prop({ required: true })
  updatedBy: string; 

  @Prop({ required: true, type: Date })
  updatedAt: Date; 
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
