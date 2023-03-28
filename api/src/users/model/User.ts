import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  first_name: string;

  @Prop()
  email: string;

  @Prop()
  last_name: string;

  @Prop()
  avatar: string;

  @Prop()
  avatarBlob: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
