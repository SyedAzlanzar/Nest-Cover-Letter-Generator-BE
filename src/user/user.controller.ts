import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Request as NestRequest,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserOnboardingDTO } from 'src/onboarding/dto/create-user-onboarding.dto';
import { AuthorizationHeader } from 'src/utils/enum';
import { RequestUser } from 'src/utils/interface';
import { GenerateCoverLetterDTO } from './dto/generate-cover-letter.dto';
import { NewUser } from './interface/user.interface';
import { UserService } from './user.service';
import { Request } from 'express';
import { GetToken } from 'src/decorators/get-token.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('me')
  @ApiOperation({ summary: "Get a user's data" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UseGuards(JwtGuard)
  getUser(@NestRequest() req: RequestUser): Promise<NewUser | null> {
    return this.userService.findById(req.user.id);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Onboard a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully onboarded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  async onboardUser(
    @NestRequest() req: RequestUser,
    @Body() onboardUser: CreateUserOnboardingDTO,
  ) {
    return this.userService.onboardUser(req.user.id, onboardUser);
  }

  @Put('onboarding/update')
  @ApiOperation({ summary: 'Update onboarding data for a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Onboarding data successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  async updateOnboarding(
    @NestRequest() req: RequestUser,
    @Body() onboardUser: CreateUserOnboardingDTO,
  ) {
    return this.userService.updateOnboarding(req.user.id, onboardUser);
  }

  @Post('generate-cover-letter')
  @ApiOperation({ summary: 'Generate a cover letter' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cover letter successfully generated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiBody({ type: GenerateCoverLetterDTO })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UseGuards(JwtGuard)
  @UsePipes(ValidationPipe)
  async generateCoverLetter(
    @Req() expressReq: Request,
    @NestRequest() req: RequestUser,
    @Body() generateCoverLetterDto: GenerateCoverLetterDTO,
    @GetToken() token: string
  ) {
    const controller = new AbortController();
    expressReq.on('close', () => {
      controller.abort();
    });

    expressReq.on('aborted', () => {
      controller.abort();
    });
    return this.userService.generateCoverLetter(
      req.user.id,
      generateCoverLetterDto,
      token,
      { signal: controller.signal },
    );
  }
}
