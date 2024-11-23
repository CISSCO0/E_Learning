import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema()
export class modules  {
    
}
export const ModulesSchema = SchemaFactory.createForClass( modules );
