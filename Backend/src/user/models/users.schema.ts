import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema ()
export class Users extends Document{
    //use mongo id 
    // @Prop({ required: true }) 
    // user_id: string;
    @Prop({ type:String ,required: true }) 
    name: string;
  
    @Prop({ type:String,required: true, unique: true }) 
    email: string;
  
    @Prop({type:String, required: true }) 
    hash_pass: string;
  
    @Prop({type:String, required: true }) 
    role: string;
  
    @Prop({type:String}) 
    pfp: string;
  
    @Prop({ type:Date,default: Date.now }) 
    createtime: Date;
}
export const UserSchema =SchemaFactory.createForClass(Users);
