import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainingEventModule } from './training-event/training-event.module';
import { TrainingBlowModule } from './training-blow/training-blow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    TrainingEventModule,
    TrainingBlowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
