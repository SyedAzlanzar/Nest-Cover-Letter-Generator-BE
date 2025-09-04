import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Onboarding } from 'src/onboarding/schemas/onboarding.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  // Reference to Onboarding
  @Prop({ type: Types.ObjectId, ref: 'Onboarding', unique: true })
  onboarding?: Types.ObjectId | Onboarding;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
