import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import { throwHttpException } from 'src/utils/exception-handling';
import { ICoverLetterPDF } from './interface/cover-letter-pdf';

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) { }

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

  async generateCoverLetterPDF(data: ICoverLetterPDF, pythonApiUrl: string) {
    const puppeteer = require('puppeteer');
    const ejs = require('ejs');
    const fs = require('fs');
    const FormData = require('form-data');

    try {
      // Load EJS template
      const ejsTemplate = fs.readFileSync(
        `src/template/${data.coverLetterLayout}.ejs`,
        'utf8',
      );

      // Render HTML with injected data
      const htmlContent = ejs.render(ejsTemplate, {
        fullname: data.fullname,
        city: data.city,
        country: data.country,
        postalcode: data.postalcode,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        paragraphs: data.paragraphs,
      });

      // Generate PDF with Puppeteer
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(htmlContent);

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });

      await browser.close();

      if (!pdfBuffer) {
        throwHttpException('File is required', HttpStatus.BAD_REQUEST);
      }

      const buffer = Buffer.isBuffer(pdfBuffer)
        ? pdfBuffer
        : Buffer.from(pdfBuffer);

      const formData = new FormData();
      formData.append('pdf', buffer, {
        filename: `cover-letter${data.companyName ? `-${data.companyName.replaceAll(" ","-")}` : ''}`,
        contentType: 'application/pdf',
      });

      const response = await axios.post(
        `${pythonApiUrl}/upload-file`,
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
      return { url: response?.data?.url };
    } catch (error) {
      throwHttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
