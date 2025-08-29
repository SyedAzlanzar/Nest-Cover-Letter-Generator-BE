import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserOnboardingDTO } from 'src/onboarding/dto/create-user-onboarding.dto';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import { Onboarding } from 'src/onboarding/schemas/onboarding.schema';
import { throwHttpException } from 'src/utils/exception-handling';
import { NewUser } from './interface/user.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly onboardingService: OnboardingService,
  ) {}

  _getNewUser(user: User): NewUser {
    return {
      id: user._id,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<NewUser | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getNewUser(user);
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
    });
    return newUser.save();
  }
/**
 *
 *
 * @param {string} userId
 * @param {CreateUserOnboardingDTO} onboardUser
 * @return {*}  {Promise<Onboarding>}
 * @memberof UserService
 */
async onboardUser(
    userId: string,
    onboardUser: CreateUserOnboardingDTO,
  ): Promise<Onboarding> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) throwHttpException('User not found', HttpStatus.NOT_FOUND);

      const onboardingData = await this.onboardingService.createOnboardingData(
        user,
        onboardUser,
      );
      return onboardingData;
    } catch (error) {
      throwHttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
