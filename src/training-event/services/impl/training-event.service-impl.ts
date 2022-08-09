import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../../di';
import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';
import { TrainingEventService } from '../training-event.service';
import { TrainingEventCreateDto } from '../../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';

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

  async getCurrent(): Promise<TrainingEventGetCurrentDto> {
    const model = await this.trainingEventRepository.getCurrent();

    if (!model) {
      throw new NotFoundException('There is no current training event');
    }

    return new TrainingEventGetCurrentDto({
      id: model.id,
      name: model.name,
      startAt: model.startAt,
      endAt: model.endAt,
      bondReward: model.bondReward,
      inTrainingMessage: model.inTrainingMessage,
      losesMessage: model.losesMessage,
      rewardMessage: model.rewardMessage,
    });
  }
}
