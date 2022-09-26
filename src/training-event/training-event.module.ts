import { Module } from '@nestjs/common';
import { publicProviders, privateProviders } from './di-providers';

import { TrainingBlowModule } from 'src/training-blow/training-blow.module';
import { TrainingEventController } from './controllers/training-event.controller';
import { ToyoPersonaTrainingEventController } from './controllers/toyo-persona-training-event.controller';
import { ToyoModule } from 'src/external/toyo/toyo.module';

@Module({
  imports: [TrainingBlowModule, ToyoModule],
  providers: [...privateProviders, ...publicProviders],
  controllers: [TrainingEventController, ToyoPersonaTrainingEventController],
  exports: publicProviders,
})
export class TrainingEventModule {}
