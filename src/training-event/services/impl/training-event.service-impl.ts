import { Inject, Injectable } from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../../di';
import trainingBlowDi from 'src/training-blow/di';
import { TrainingEventModel } from 'src/training-event/models/training-event.model';
import { TrainingEventRepository } from 'src/training-event/repositories/training-event.repository';
import { TrainingEventService } from '../training-event.service';
import {
  TrainingEventConfigDto,
  TrainingEventCreateDto,
} from '../../dto/training-event/create.dto';
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

  async create(dto: TrainingEventConfigDto): Promise<UUID> {
    try {
      const body: TrainingEventCreateDto = dto.eventConfig;
      let model = new TrainingEventModel(body);
      await this._checkBlows(model);

      model = await this._repository.save(model);
      return model.id;
    } catch (er) {
      console.log(er);
    }
  }

  private async _checkBlows(model: TrainingEventModel) {
    for (const blowId of model.blows) {
      try {
        await this._trainingBlowService.getById(blowId);
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw new ConstraintViolationError(error.message);
        }
        throw error;
      }
    }
  }

  async getCurrent(): Promise<TrainingEventGetCurrentDto> {
    const model = await this._repository.getCurrent();

    if (!model) {
      throw new NotFoundError('There is no current training event');
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
      blows: model.blows,
      blowsConfig: model.blowsConfig,
    });
  }
}
