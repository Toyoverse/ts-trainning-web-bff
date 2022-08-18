import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../../di';
import trainingBlowDi from 'src/training-blow/di';
import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';
import { TrainingEventService } from '../training-event.service';
import { TrainingEventCreateDto } from '../../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ConstraintViolationError } from 'src/errors/constraint-violation.error';
import { TrainingBlowService } from 'src/training-blow/services/training-blow.service';
import { NotFoundError } from 'src/errors';

@Injectable()
export class TrainingEventServiceImpl implements TrainingEventService {
  constructor(
    @Inject(di.TRAINING_EVENT_REPOSITORY)
    private _repository: TrainingEventRepository,
    @Inject(trainingBlowDi.TRAINING_BLOW_SERVICE)
    private _trainingBlowService: TrainingBlowService,
  ) {}

  async create(dto: TrainingEventCreateDto): Promise<UUID> {
    let model = new TrainingEventModel(dto);
    model = await this._repository.save(model);
    return model.id;
  }

  async getCurrent(): Promise<TrainingEventGetCurrentDto> {
    const model = await this._repository.getCurrent();

    if (!model) {
      throw new NotFoundError('There is no current training event');
    }

    const blows = [];

    for (const blowId of model.blows) {
      const blow = await this._trainingBlowService.getById(blowId);
      blows.push(blow);
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
      blows,
      blowsConfig: model.blowsConfig,
    });
  }
}
