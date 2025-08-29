import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';

import { NewUserDTO } from 'src/user/dto/new-user.dto';
import { AuthService } from './auth.service';
import { NewUser } from 'src/user/interface/user.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtDTO } from './dto/jwt.dto';
import { AuthorizationHeader } from 'src/utils/enum';

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
    schema: {
      example: {
        name: 'John Doe',
        email: 'johndoe@test.com',
        password: 'password',
      },
    },
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
    schema: {
      example: {
        email: 'johndoe@test.com',
        password: 'password',
      },
    },
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
  verifyJwt(@Body() payload: JwtDTO) {
    return this.authService.verifyJwt(payload.jwt);
  }
}
