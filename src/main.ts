import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { AppModule } from './app.module';
import { AuthorizationHeader } from './utils/enum';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.setViewEngine('ejs');

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });

  const theme = new SwaggerTheme();
  const config = new DocumentBuilder()
    .setTitle('Cover Letter Generator App')
    .setDescription('API documentation for Cover Letter Generator App.')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      AuthorizationHeader.BEARER, // Name of the authorization scheme
    )
    .addTag('Cover Letter Generator App')
    .build();

  const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, options);

  const port = configService.get('app.port');

  Logger.log('Database connection established');

  Logger.log(`🚀 Server up and running at port ${port}`);

  await app.listen(port);
}
bootstrap();
