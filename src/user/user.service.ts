import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model, ObjectId } from 'mongoose';
import { CreateUserOnboardingDTO } from 'src/onboarding/dto/create-user-onboarding.dto';
import { OnboardingService } from 'src/onboarding/onboarding.service';
import { Onboarding } from 'src/onboarding/schemas/onboarding.schema';
import { throwHttpException } from 'src/utils/exception-handling';
import { GenerateCoverLetterDTO } from './dto/generate-cover-letter.dto';
import { NewUser } from './interface/user.interface';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly onboardingService: OnboardingService,
    private readonly configService: ConfigService,
  ) {}

  _getNewUser(user: User): NewUser {
    return {
      id: user._id,
      email: user.email,
      onboarding: user?.onboarding || null,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    // check if user has onboarded
    const user = await this.userModel.findOne({ email }).populate('onboarding')
    return user;
  }

  async findById(id: string): Promise<NewUser | null> {
    const user = await this.userModel.findById(id).populate('onboarding').exec();
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
    userId: ObjectId,
    onboardUser: CreateUserOnboardingDTO,
  ): Promise<Onboarding> {
    try {
      const user = await this.userModel.findById(userId)
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

  async generateCoverLetter(
    userId: string,
    generateCoverLetterDto: GenerateCoverLetterDTO,
    options?: { signal: AbortSignal },
  ): Promise<{ success: boolean; coverLetterUrl: string }> {
    try {
      const user = await this.userModel.findById(userId);

      if (!user) throwHttpException('User not found', HttpStatus.NOT_FOUND);

      const onboarding = await this.onboardingService.findByUserId(
        user._id,
      );

      if (!onboarding)
        throwHttpException(
          'Please complete your onboarding profile',
          HttpStatus.NOT_FOUND,
        );

      const payload = {
        job_title: generateCoverLetterDto.jobTitle,
        company_name: generateCoverLetterDto.companyName,
        job_details: generateCoverLetterDto.jobDescription,
        email: user.email,
        city: onboarding.city,
        country: onboarding.country,
        phone_number: onboarding.phoneNumber,
        postal_code: onboarding.postalCode,
        resume_path: onboarding.resumeLink,
        full_name: onboarding.fullName,
      };

      const pythonApiUrl = this.configService.get<string>('app.python_api_url');

      if (!pythonApiUrl) {
        throwHttpException(
          'server URL is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const response = await axios.post(`${pythonApiUrl}/generate`, payload, {
        signal: options?.signal,
      });

      if (response.status !== 200) {
        throwHttpException(
          'Failed to generate cover letter',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        success: true,
        coverLetterUrl: response.data.pdf_url,
      };
    } catch (error) {
      console.log("🚀 ~ UserService ~ generateCoverLetter ~ error:", error)
      if (error.message === 'aborted') {
        console.log('❌ Request was aborted');
        throwHttpException('Request was aborted', HttpStatus.REQUEST_TIMEOUT);
      }
      throwHttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
