import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import { throwHttpException } from 'src/utils/exception-handling';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {}

  async uploadResume(
    file: Express.Multer.File,
  ): Promise<{ resumeLink: string }> {
    try {
      const pythonApiUrl = this.configService.get<string>('app.python_api_url');

      if (!pythonApiUrl) {
        throwHttpException(
          'Uploading server URL is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!file) {
        throwHttpException('File is required', HttpStatus.BAD_REQUEST);
      }

      const formData = new FormData();
      formData.append('resume', file.buffer, file.originalname);

      const response = await axios.post(
        `${pythonApiUrl}/upload-resume`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      if (!response.data?.url) {
        throwHttpException(
          'Invalid response from Python API',
          HttpStatus.BAD_GATEWAY,
        );
      }

      return { resumeLink: response.data.url };
    } catch (error) {
      const detail =
        error?.response?.data || error?.message || 'Failed to upload resume';
      throwHttpException(detail, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
