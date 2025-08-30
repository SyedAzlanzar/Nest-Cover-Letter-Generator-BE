import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware'; // ✅ Import the middleware
import { OnboardingModule } from './onboarding/onboarding.module';
import { JwtModule } from '@nestjs/jwt';
import { MediaModule } from './media/media.module';

@Module({
  imports: [DatabaseModule, ConfigModule, AuthModule,OnboardingModule,JwtModule,MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // ✅ Apply to all routes
  }
}
