import { Module } from '@nestjs/common';
import providers from './di-providers';

import { TrainingBlowModule } from 'src/training-blow/training-blow.module';
import { TrainingEventController } from './controllers/training-event.controller';
import { ToyoPersonaTrainingEventController } from './controllers/toyo-persona-training-event.controller';
import { ToyoModule } from 'src/external/toyo/toyo.module';

@Module({
  imports: [TrainingBlowModule, ToyoModule],
  providers: [
    providers.CardTrainingRewardMetadataRepository,
    providers.CardTrainingRewardService,
    providers.ToyoPersonaTrainingEventRepository,
    providers.ToyoPersonaTrainingEventService,
    providers.TrainingEventRepository,
    providers.TrainingEventService,
  ],
  controllers: [TrainingEventController, ToyoPersonaTrainingEventController],
  exports: [
    providers.TrainingEventService,
    providers.ToyoPersonaTrainingEventService,
  ],
})
export class TrainingEventModule {}
