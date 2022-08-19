import { UUID } from 'src/types/common';
import { TrainingEventConfigDto } from '../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from '../dto/training-event/get-current.dto';

export interface TrainingEventService {
  create(request: TrainingEventConfigDto): Promise<UUID>;
  getCurrent(): Promise<TrainingEventGetCurrentDto>;
}
