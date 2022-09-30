import { TrainingEventModel } from '../models/training-event.model';

export interface TrainingEventRepository {
  getCurrent(): Promise<TrainingEventModel | undefined>;
  save(model: TrainingEventModel): Promise<TrainingEventModel>;
  isDatesConflicting(startDate: Date, endDate: Date): Promise<boolean>;
  getById(id: string): Promise<TrainingEventModel>;
}
