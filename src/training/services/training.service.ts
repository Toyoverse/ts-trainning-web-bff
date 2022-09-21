import { ListTrainingDto } from '../dto/list.dto';
import { TrainingStartDto } from '../dto/start.dto';
import { TrainingModel } from '../models/training.model';

export interface TrainingService {
  start(id: TrainingStartDto): Promise<TrainingModel>;
  close(id: string, loggedPlayerId: string): Promise<TrainingModel>;
  list(id: string): Promise<ListTrainingDto[]>;
  getResult(id: string, loggedPlayerId: string): Promise<TrainingModel>;
}
