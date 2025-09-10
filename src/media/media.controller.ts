// src/media/media.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizationHeader } from 'src/utils/enum';
import { MediaService } from './media.service';
import { GetToken } from 'src/decorators/get-token.decorator';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload-resume')
  @ApiOperation({ summary: 'Upload a resume file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Resume uploaded successfully' })
  @UsePipes(ValidationPipe)
  @UseGuards(JwtGuard)
  @ApiBearerAuth(AuthorizationHeader.BEARER)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        resume: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('resume'))
  async uploadResume(@UploadedFile() file: Express.Multer.File,@GetToken() token:string) {
    return this.mediaService.uploadResume(file,token);
  }
}
