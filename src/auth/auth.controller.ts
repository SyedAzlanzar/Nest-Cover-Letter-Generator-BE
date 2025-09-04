import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NewUserDTO } from 'src/user/dto/new-user.dto';
import { NewUser } from 'src/user/interface/user.interface';
import { AuthorizationHeader } from 'src/utils/enum';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { RequestUser } from 'src/utils/interface';
import { Request as NestRequest } from '@nestjs/common';
import { GetToken } from 'src/decorators/get-token.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user and creates a Stripe customer account for the user.
   * @Body {RegisterUserDto} user - The user object containing user registration details.
   * @returns {Promise<NewUser | null>} Returns a Promise that resolves to a User object.
   */

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
  })
  @ApiBody({
    type: NewUserDTO,
  })
  @Post('register')
  register(@Body() user: NewUserDTO): Promise<NewUser | null> {
    return this.authService.register(user);
  }
  
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logs in user and returns JWT token',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  @ApiBody({
    type: ExistingUserDTO,
  })
  @Post('login')
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }

  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify JWT token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'JWT token is valid',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid JWT token',
  })
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @UseGuards(JwtGuard)
  verifyJwt(@GetToken() token: string) {
    return this.authService.verifyJwt(token);
  }
}
