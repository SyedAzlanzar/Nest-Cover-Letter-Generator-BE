import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Onboarding')
@Controller('onboarding')
export class OnboardingController {}
