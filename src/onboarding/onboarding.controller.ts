import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserOnboardingDTO } from './dto/create-user-onboarding.dto';
import { OnboardingService } from './onboarding.service';
import { Onboarding } from './schemas/onboarding.schema';

@ApiTags('User Onboarding')
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  // @Post()
  // @ApiOperation({ summary: 'Create onboarding record' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Onboarding record created successfully',
  //   type: Onboarding,
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // @ApiBody({ type: CreateUserOnboardingDTO })
  // async create(@Body() dto: CreateUserOnboardingDTO) {
  //   return this.onboardingService.create(dto);
  // }
}
