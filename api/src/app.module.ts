import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', ''),
        password: configService.get('DATABASE_PASSWORD', ''),
        database: configService.get('DATABASE_NAME', ''),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DATABASE_LOGGING', false),
      }),
      inject: [ConfigService],
    }),
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
