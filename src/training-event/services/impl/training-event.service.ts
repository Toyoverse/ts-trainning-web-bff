import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../../../training-event/di';
import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';
import { TrainingEventService } from '../training-event.service';
import { TrainingEventCreateDto } from '../../dto/training-event.dtos';

@Injectable()
export class TrainingEventServiceImpl implements TrainingEventService {
  constructor(
    @Inject(di.TRAINING_EVENT_REPOSITORY)
    private trainingEventRepository: TrainingEventRepository,
  ) {}

  async create(dto: TrainingEventCreateDto): Promise<UUID> {
    let model = new TrainingEventModel(dto);
    model = await this.trainingEventRepository.save(model);
    return model.id;
  }
}
