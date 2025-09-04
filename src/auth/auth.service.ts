import { HttpStatus, Injectable } from '@nestjs/common';
import { ExistingUserDTO } from '../user/dto/existing-user.dto';

import * as bcrypt from 'bcrypt';
import { NewUserDTO } from 'src/user/dto/new-user.dto';

import { JwtService } from '@nestjs/jwt';
import { NewUser } from 'src/user/interface/user.interface';
import { throwHttpException } from 'src/utils/exception-handling';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDTO>): Promise<NewUser | any> {
    const { email, password } = user;

    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throwHttpException(
        'Email already in use',
        HttpStatus.CONFLICT,
      );

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userService.create(email, hashedPassword);
    return this.userService._getNewUser(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<NewUser | null> {
    const user = await this.userService.findByEmail(email)
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );

    if (!doesPasswordMatch) return null;

    return this.userService._getNewUser(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string; user: NewUser } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user)
      throwHttpException('Credentials invalid!', HttpStatus.UNAUTHORIZED);

    const jwt = await this.jwtService.signAsync({ id:user.id, email: user.email });
    return { token: jwt, user };
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      throwHttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }
}
