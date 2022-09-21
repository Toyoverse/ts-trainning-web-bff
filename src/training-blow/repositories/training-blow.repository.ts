import { TrainingBlowModel } from '../models/training-blow.model';

export interface TrainingBlowRepository {
  save(model: TrainingBlowModel): Promise<TrainingBlowModel>;
  getById(id: string): Promise<TrainingBlowModel>;
}
