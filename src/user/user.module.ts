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

@Module({
  imports: [
    OnboardingModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Onboarding.name,
        schema: OnboardingSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, OnboardingService],
  exports: [UserService, OnboardingService],
})
export class UserModule {}
