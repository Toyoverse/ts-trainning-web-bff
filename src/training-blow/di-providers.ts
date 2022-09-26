import di from './di';
import { TrainingBlowRepositoryImpl } from './repositories/impl/training-blow.repository-impl';
import { TrainingBlowServiceImpl } from './services/impl/training-blow.service-impl';

export const privateProviders = [
  {
    provide: di.TRAINING_BLOW_REPOSITORY,
    useClass: TrainingBlowRepositoryImpl,
  },
];

export const publicProviders = [
  {
    provide: di.TRAINING_BLOW_SERVICE,
    useClass: TrainingBlowServiceImpl,
  },
];
