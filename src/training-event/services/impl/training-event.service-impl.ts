import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../../di';
import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';
import { TrainingEventService } from '../training-event.service';
import { TrainingEventCreateDto } from '../../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ConstraintViolationError } from 'src/errors/constraint-violation.error';

@Injectable()
export class TrainingEventServiceImpl implements TrainingEventService {
  constructor(
    @Inject(di.TRAINING_EVENT_REPOSITORY)
    private _repository: TrainingEventRepository,
  ) {}

  async create(dto: TrainingEventCreateDto): Promise<UUID> {
    try {
      let model = new TrainingEventModel(dto);
      model = await this._repository.save(model);
      return model.id;
    } catch (error) {
      if (error instanceof ConstraintViolationError) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async getCurrent(): Promise<TrainingEventGetCurrentDto> {
    const model = await this._repository.getCurrent();

    if (!model) {
      throw new NotFoundException('There is no current training event');
    }

    return new TrainingEventGetCurrentDto({
      id: model.id,
      name: model.name,
      startAt: model.startAt,
      endAt: model.endAt,
      story: model.story,
      bondReward: model.bondReward,
      bonusBondReward: model.bonusBondReward,
      toyoTrainingConfirmationMessage: model.toyoTrainingConfirmationMessage,
      inTrainingMessage: model.inTrainingMessage,
      losesMessage: model.losesMessage,
      rewardMessage: model.rewardMessage,
      blowsConfig: model.blowsConfig,
    });
  }
}
