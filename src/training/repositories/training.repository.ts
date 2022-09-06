import { TrainingStartDto } from '../dto/start.dto';
import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(dto: TrainingStartDto): Promise<TrainingModel>;
  close(id: string): Promise<TrainingModel>;
  list(player: Parse.Object<Parse.Attributes>): Promise<TrainingModel[]>;
}
