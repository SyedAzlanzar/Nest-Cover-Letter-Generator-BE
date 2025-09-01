import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types,Schema as MongoSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Onboarding extends Document {
  @Prop({ required: true, example: 'Azlan' })
  firstName: string;

  @Prop({ example: 'Zar' })
  lastName?: string;

  @Prop({ required: true, example: 'Pakistan' })
  country: string;

  @Prop({ required: true, example: 'Karachi' })
  city: string;

  @Prop({ required: true, example: '12345' })
  postalCode: string;

  @Prop({ required: true, example: '+923001234567' })
  phoneNumber: string;

  @Prop({ required: true, example: 'Syed Azlan Zar' })
  fullName: string;

  @Prop({ required: true, example: 'https://example.com/resume.pdf' })
  resumeLink: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongoSchema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
  
}

export const OnboardingSchema = SchemaFactory.createForClass(Onboarding);
