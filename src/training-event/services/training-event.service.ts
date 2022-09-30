import { UUID } from 'src/types/common';
import { TrainingEventDto } from '../dto/training-event/dto';
import { TrainingEventCreateDto } from '../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from '../dto/training-event/get-current.dto';

export interface TrainingEventService {
  create(request: TrainingEventCreateDto): Promise<UUID>;
  getCurrent(): Promise<TrainingEventGetCurrentDto>;
  getById(id: string): Promise<TrainingEventDto>;
}
