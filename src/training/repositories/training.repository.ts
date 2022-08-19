import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(model: TrainingModel): Promise<TrainingModel>;
  close(id: string): Promise<TrainingModel>;
  list(): Promise<any>;
}
