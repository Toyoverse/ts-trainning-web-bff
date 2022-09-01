import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import di from '../../di';
import { TrainingRepository } from '../../../training/repositories/training.repository';
import { TrainingService } from '../training.service';
import { TrainingStartDto } from '../../../training/dto/start.dto';
import { TrainingModel } from '../../../training/models/training.model';

@Injectable()
export class TrainingServiceImpl implements TrainingService {
  constructor(
    @Inject(di.TRAINING_REPOSITORY)
    private trainingRepository: TrainingRepository,
  ) {}

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const model = await this.trainingRepository.start(dto);

    if (!model) {
      throw new InternalServerErrorException('An error occurred');
    }

    return model;
  }

  async close(id: string): Promise<TrainingModel> {
    const model = await this.trainingRepository.close(id);

    if (!model) {
      throw new InternalServerErrorException('An error occurred');
    }

    return model;
  }

  async list(playerId: string): Promise<TrainingModel[]> {
    const data = await this.trainingRepository.list(playerId);
    return data;
  }
}
