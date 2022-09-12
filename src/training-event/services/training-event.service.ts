import { UUID } from 'src/types/common';
import { TrainingEventCreateDto } from '../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from '../dto/training-event/get-current.dto';

export interface TrainingEventService {
  create(request: TrainingEventCreateDto): Promise<UUID>;
  getCurrent(): Promise<TrainingEventGetCurrentDto>;
  getById(id: string): Promise<Parse.Object<Parse.Attributes>>;
}
