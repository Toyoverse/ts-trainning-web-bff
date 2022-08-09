import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrainingEventModule } from './training-event/training-event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    TrainingEventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
