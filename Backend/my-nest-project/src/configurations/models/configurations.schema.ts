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

  @Prop({ required: true })
  createdBy: string;  // New field to track who created the configuration

  @Prop({ required: true, type: Date })
  createdAt: Date;  // New field to track when the configuration was created

}


export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);
