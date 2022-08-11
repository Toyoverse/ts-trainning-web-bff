import { UUID } from 'src/types/common';
import { TrainingBlowCreateDto } from '../dto/create.dto';

export interface TrainingBlowService {
  create(dto: TrainingBlowCreateDto): Promise<UUID>;
}
