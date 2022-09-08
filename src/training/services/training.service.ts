import { ListTrainingDto } from '../dto/list.dto';
import { TrainingStartDto } from '../dto/start.dto';
import { TrainingModel } from '../models/training.model';

export interface TrainingService {
  start(request: TrainingStartDto): Promise<TrainingModel>;
  close(request: string): Promise<TrainingModel>;
  list(request: string): Promise<ListTrainingDto[]>;
}
