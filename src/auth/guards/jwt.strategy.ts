import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { NewUser } from 'src/user/interface/user.interface';
import { UserService } from 'src/user/user.service';

interface JWT {
  user: {
    id: string;
    email: string;
  };
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt_secret'),
    });
  }

  async validate({ user }: JWT): Promise<NewUser> {
    const foundUser = await this.usersService.findById(user.id);
    return foundUser;
  }
}
