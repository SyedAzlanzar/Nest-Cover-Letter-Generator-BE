import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsPhoneNumber,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserOnboardingDTO {
  @ApiProperty({ example: 'Azlan' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Zar', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 'Karachi' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: '+923001234567' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Syed Azlan Zar' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'https://example.com/resume.pdf' })
  @IsUrl()
  @IsNotEmpty()
  resumeLink: string;

}
