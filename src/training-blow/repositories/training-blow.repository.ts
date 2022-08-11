import { TrainingBlowModel } from '../models/training-blow.model';

export interface TrainingBlowRepository {
  save(model: TrainingBlowModel): Promise<TrainingBlowModel>;
}
