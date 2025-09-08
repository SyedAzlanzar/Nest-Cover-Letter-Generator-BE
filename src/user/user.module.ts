import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { OnboardingModule } from 'src/onboarding/onboarding.module';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import {
  Onboarding,
  OnboardingSchema,
} from 'src/onboarding/schemas/onboarding.schema';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    OnboardingModule,
    MediaModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
