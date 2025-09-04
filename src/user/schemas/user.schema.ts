import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types,Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ type:MongoSchema.Types.ObjectId, ref: 'Onboarding' })
  onboarding?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
