import di from './di';
import { TrainingEventRepositoryImpl } from './repositories/impl/training-event.repository';
import { TrainingEventServiceImpl } from './services/impl/training-event.service';

const providers = [
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
