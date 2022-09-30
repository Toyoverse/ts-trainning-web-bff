import { UUID } from 'src/types/common';
import { ToyoPersonaTrainingEventCreateDto } from '../dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventDto } from '../dto/toyo-persona-training-event/dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from '../dto/toyo-persona-training-event/get-current.dto';

export interface ToyoPersonaTrainingEventService {
  create(createDto: ToyoPersonaTrainingEventCreateDto): Promise<UUID>;
  getCurrent(
    toyoPersonaId: string,
  ): Promise<ToyoPersonaTrainingEventGetCurrentDto>;
  getByTrainingEventAndPersona(
    trainingEventId: string,
    toyoPersonaId: string,
  ): Promise<ToyoPersonaTrainingEventDto>;
}
