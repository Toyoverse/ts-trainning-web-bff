import { Module } from '@nestjs/common';
import providers from './di-providers';
import { TrainingController } from './controllers/training.controller';
import { PlayerModule } from 'src/external/player/player.module';
import { ToyoModule } from 'src/external/toyo/toyo.module';
import { TrainingEventModule } from 'src/training-event/training-event.module';

@Module({
  imports: [TrainingEventModule, PlayerModule, ToyoModule],
  providers: [providers.TrainingRepository, providers.TrainingService],
  controllers: [TrainingController],
})
export class TrainingModule {}
