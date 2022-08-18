import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(model: TrainingModel): Promise<TrainingModel>;
  close(id: string): Promise<any>;
  list(): Promise<any>;
}
