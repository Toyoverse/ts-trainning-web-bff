import di from './di';
import { TrainingRepositoryImpl } from './repositories/impl/training.repository-impl';
import { TrainingServiceImpl } from './services/impl/training.service-impl';

const providers = [
  {
    provide: di.TRAINING_SERVICE,
    useClass: TrainingServiceImpl,
  },
  {
    provide: di.TRAINING_REPOSITORY,
    useClass: TrainingRepositoryImpl,
  },
];

export default providers;
