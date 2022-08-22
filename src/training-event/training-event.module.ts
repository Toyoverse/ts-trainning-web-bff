import { Module } from '@nestjs/common';
import providers from './di-providers';

import { TrainingBlowModule } from 'src/training-blow/training-blow.module';
import { TrainingEventController } from './controllers/training-event.controller';
import { ToyoPersonaTrainingEventController } from './controllers/toyo-persona-training-event.controller';

@Module({
  imports: [TrainingBlowModule],
  providers: providers,
  controllers: [TrainingEventController, ToyoPersonaTrainingEventController],
})
export class TrainingEventModule {}
