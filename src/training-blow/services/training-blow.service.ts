import { UUID } from 'src/types/common';
import { TrainingBlowCreateDto } from '../dto/create.dto';
import { TrainingBlowGetByIdDto } from '../dto/getbyid.dto';

export interface TrainingBlowService {
  create(dto: TrainingBlowCreateDto): Promise<UUID>;
  getById(id: string): Promise<TrainingBlowGetByIdDto>;
}
