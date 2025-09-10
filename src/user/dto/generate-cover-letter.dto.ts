import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';
import { COVER_LETTER_LAYOUT } from 'src/media/enum';

export class GenerateCoverLetterDTO {
  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  @Trim()
  @MaxLength(100, {
    message: 'Job title is too long. Max 100 characters allowed.',
  })
  jobTitle: string;

  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @Trim()
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(100, {
    message: 'Company name is too long. Max 100 characters allowed.',
  })
  companyName: string;

  @ApiProperty({ example: 'We are looking for a skilled software engineer to join our team.' })
  @IsString()
  @Trim()
  @IsNotEmpty({ message: 'Job description is required' })
  jobDescription: string;

  @ApiProperty({
    example: COVER_LETTER_LAYOUT.CL_SHOW_1,
    enum: COVER_LETTER_LAYOUT,
    description: 'Layout option for the cover letter',
  })
  @IsEnum(COVER_LETTER_LAYOUT, { message: 'Invalid cover letter layout option' })
  @IsNotEmpty({ message: 'Cover letter layout is required' })
  coverLetterLayout: COVER_LETTER_LAYOUT;


}
