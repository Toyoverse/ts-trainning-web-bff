import { TrainingStartDto } from '../dto/start.dto';
import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(dto: TrainingStartDto): Promise<TrainingModel>;
  close(id: string): Promise<TrainingModel>;
  list(playerId: string): Promise<TrainingModel[]>;
}
