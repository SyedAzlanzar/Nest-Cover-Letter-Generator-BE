import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import authConfig from './auth.config';

@Module({
    imports:[
        NestConfigModule.forRoot({
            ignoreEnvFile: false,
            load: [appConfig, databaseConfig, authConfig],
            envFilePath: '.env',
            isGlobal: true,
          }),
    ]
})
export class ConfigModule {}
