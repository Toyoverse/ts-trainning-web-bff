import di from './di';
import { TrainingRepositoryImpl } from './repositories/impl/training.repository-impl';
import { TrainingServiceImpl } from './services/impl/training.service-impl';

const providers = {
  TrainingService: {
    provide: di.TRAINING_SERVICE,
    useClass: TrainingServiceImpl,
  },
  TrainingRepository: {
    provide: di.TRAINING_REPOSITORY,
    useClass: TrainingRepositoryImpl,
  },
};

export default providers;
