import di from './di';
import { TrainingBlowRepositoryImpl } from './repositories/impl/training-blow.repository-impl';
import { TrainingBlowServiceImpl } from './services/impl/training-blow.service-impl';

const providers = [
  {
    provide: di.TRAINING_BLOW_SERVICE,
    useClass: TrainingBlowServiceImpl,
  },
  {
    provide: di.TRAINING_BLOW_REPOSITORY,
    useClass: TrainingBlowRepositoryImpl,
  },
];

export default providers;
