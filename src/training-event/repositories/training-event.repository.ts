import { TrainingEventModel } from '../models/training-event.model';

export interface TrainingEventRepository {
  getCurrent(): Promise<TrainingEventModel | undefined>;
  save(model: TrainingEventModel): Promise<TrainingEventModel>;
}
