import { TrainingEventModel } from '../models/training-event.model';

export interface TrainingEventRepository {
  save(model: TrainingEventModel): Promise<TrainingEventModel>;
}
