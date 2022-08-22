import { UUID } from 'src/types/common';
import { ToyoPersonaTrainingEventCreateDto } from '../dto/toyo-persona-training-event/create.dto';

export interface ToyoPersonaTrainingEventService {
  create(createDto: ToyoPersonaTrainingEventCreateDto): Promise<UUID>;
}
