import di from './di';
import { TrainingBlowRepositoryImpl } from './repositories/impl/training-blow.repository-impl';
import { TrainingBlowServiceImpl } from './services/impl/training-blow.service-impl';

const providers = {
  TrainingBlowService: {
    provide: di.TRAINING_BLOW_SERVICE,
    useClass: TrainingBlowServiceImpl,
  },
  TrainingBlowRepository: {
    provide: di.TRAINING_BLOW_REPOSITORY,
    useClass: TrainingBlowRepositoryImpl,
  },
};

export default providers;
