import { UUID } from 'src/types/common';
import { TrainingEventCreateDto } from '../dto/training-event.dtos';

export interface TrainingEventService {
  create(request: TrainingEventCreateDto): Promise<UUID>;
}
