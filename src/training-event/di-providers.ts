import di from './di';
import { CardTrainingRewardMetadataRepositoryImpl } from './repositories/impl/card-training-reward-metadata.repository-impl';
import { ToyoPersonaTrainingEventRepositoryImpl } from './repositories/impl/toyo-persona-training-event.repository-impl';
import { TrainingEventRepositoryImpl } from './repositories/impl/training-event.repository-impl';
import { CardTrainingRewardServiceImpl } from './services/impl/card-training-reward.service-impl';
import { ToyoPersonaTrainingEventServiceImpl } from './services/impl/toyo-persona-training-event.service-impl';
import { TrainingEventServiceImpl } from './services/impl/training-event.service-impl';

const providers = {
  CardTrainingRewardMetadataRepository: {
    provide: di.CARD_TRAINING_REWARD_METADATA_REPOSITORY,
    useClass: CardTrainingRewardMetadataRepositoryImpl,
  },
  CardTrainingRewardService: {
    provide: di.CARD_TRAINING_REWARD_SERVICE,
    useClass: CardTrainingRewardServiceImpl,
  },
  ToyoPersonaTrainingEventRepository: {
    provide: di.TOYO_PERSONA_TRAINING_EVENT_REPOSITORY,
    useClass: ToyoPersonaTrainingEventRepositoryImpl,
  },
  ToyoPersonaTrainingEventService: {
    provide: di.TOYO_PERSONA_TRAINING_EVENT_SERVICE,
    useClass: ToyoPersonaTrainingEventServiceImpl,
  },
  TrainingEventService: {
    provide: di.TRAINING_EVENT_SERVICE,
    useClass: TrainingEventServiceImpl,
  },
  TrainingEventRepository: {
    provide: di.TRAINING_EVENT_REPOSITORY,
    useClass: TrainingEventRepositoryImpl,
  },
};

export default providers;
