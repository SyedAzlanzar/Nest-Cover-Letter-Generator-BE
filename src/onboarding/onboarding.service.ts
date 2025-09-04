import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { throwHttpException } from 'src/utils/exception-handling';
import { CreateUserOnboardingDTO } from './dto/create-user-onboarding.dto';
import { Onboarding } from './schemas/onboarding.schema';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(Onboarding.name) private onboardingModel: Model<Onboarding>,
  ) {}
  /**
   *
   *
   * @param {User} user
   * @param {CreateUserOnboardingDTO} dto
   * @return {*}  {Promise<Onboarding>}
   * @memberof OnboardingService
   */
  async createOnboardingData(
    user: User,
    dto: CreateUserOnboardingDTO,
  ): Promise<Onboarding> {
    try {
      const existingOnboarding = await this.onboardingModel.findOne({
        user: user.id,
      });
      if (existingOnboarding) {
        throwHttpException('User is already onboarded', HttpStatus.CONFLICT);
      }
      const newOnboarding = new this.onboardingModel({
        ...dto,
        user: user.id,
      });
      await newOnboarding.save();
      return newOnboarding;
    } catch (error) {
      throwHttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async getOnboardingData(userId: ObjectId): Promise<Onboarding | null> {
    return this.onboardingModel.findOne({ user: userId }).exec();
  }
}
