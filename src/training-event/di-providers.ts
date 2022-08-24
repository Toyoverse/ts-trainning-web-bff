import di from './di';
import { ToyoPersonaTrainingEventRepositoryImpl } from './repositories/impl/toyo-persona-training-event.repository-impl';
import { TrainingEventRepositoryImpl } from './repositories/impl/training-event.repository-impl';
import { ToyoPersonaTrainingEventServiceImpl } from './services/impl/toyo-persona-training-event.service-impl';
import { TrainingEventServiceImpl } from './services/impl/training-event.service-impl';

const providers = [
  {
    provide: di.TOYO_PERSONA_TRAINING_EVENT_REPOSITORY,
    useClass: ToyoPersonaTrainingEventRepositoryImpl,
  },
  {
    provide: di.TOYO_PERSONA_TRAINING_EVENT_SERVICE,
    useClass: ToyoPersonaTrainingEventServiceImpl,
  },
  {
    provide: di.TRAINING_EVENT_SERVICE,
    useClass: TrainingEventServiceImpl,
  },
  {
    provide: di.TRAINING_EVENT_REPOSITORY,
    useClass: TrainingEventRepositoryImpl,
  },
];

export default providers;
