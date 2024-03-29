import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './external/player/player.module';
import { TrainingBlowModule } from './training-blow/training-blow.module';
import { TrainingEventModule } from './training-event/training-event.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
    }),
    TrainingModule,
    TrainingEventModule,
    TrainingBlowModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
