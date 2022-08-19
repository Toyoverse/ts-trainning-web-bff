import { Inject, Injectable } from '@nestjs/common';
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
    let model = new TrainingModel(dto);
    model = await this.trainingRepository.start(model);
    return model;
  }

  async close(id: string): Promise<TrainingModel> {
    const data = await this.trainingRepository.close(id);
    return data;
  }

  async list(): Promise<any> {
    const data = await this.trainingRepository.list();
    return data;
  }
}
