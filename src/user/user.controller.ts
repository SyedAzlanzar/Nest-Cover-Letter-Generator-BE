import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Request as NestRequest,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserOnboardingDTO } from 'src/onboarding/dto/create-user-onboarding.dto';
import { AuthorizationHeader } from 'src/utils/enum';
import { RequestUser } from 'src/utils/interface';
import { NewUser } from './interface/user.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
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
  getUser(@Param('id') id: string): Promise<NewUser | null> {
    return this.userService.findById(id);
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
}
