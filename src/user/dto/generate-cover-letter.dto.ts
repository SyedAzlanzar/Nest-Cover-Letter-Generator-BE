import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class GenerateCoverLetterDTO {
  @ApiProperty({example: 'Software Engineer'})
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @Trim()
  @MaxLength(100, {
    message: 'Job title is too long. Max 100 characters allowed.',
  })
  jobTitle: string;

  @ApiProperty({example: 'Tech Corp'})
  @IsString()
  @Trim()
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(100, {
    message: 'Company name is too long. Max 100 characters allowed.',
  })
  companyName: string;

  @ApiProperty({example: 'We are looking for a skilled software engineer to join our team.'})
  @IsString()
  @Trim()
  @IsNotEmpty({ message: 'Job description is required' })
  jobDescription: string;
}
