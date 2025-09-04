import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Onboarding, OnboardingSchema } from './schemas/onboarding.schema';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Onboarding.name, schema: OnboardingSchema },
    ]),
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService,MongooseModule],
})
export class OnboardingModule {}
