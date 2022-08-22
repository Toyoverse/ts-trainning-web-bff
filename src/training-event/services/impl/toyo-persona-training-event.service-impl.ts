import { Inject, Injectable } from '@nestjs/common';
import { TrainingBlowService } from 'src/training-blow/services/training-blow.service';
import di from 'src/training-event/di';
import trainingBlowsDi from 'src/training-blow/di';
import { ToyoPersonaTrainingEventCreateDto } from 'src/training-event/dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { ToyoPersonaTrainingEventRepository } from 'src/training-event/repositories/toyo-persona-training-event.repository';
import { UUID } from 'src/types/common';
import { ToyoPersonaTrainingEventService } from '../toyo-persona-training-event.service';
import { ConstraintViolationError, NotFoundError } from 'src/errors';

@Injectable()
export class ToyoPersonaTrainingEventServiceImpl
  implements ToyoPersonaTrainingEventService
{
  constructor(
    @Inject(di.TOYO_PERSONA_TRAINING_EVENT_REPOSITORY)
    private _repository: ToyoPersonaTrainingEventRepository,
    @Inject(trainingBlowsDi.TRAINING_BLOW_SERVICE)
    private _blowsService: TrainingBlowService,
  ) {}

  async create(createDto: ToyoPersonaTrainingEventCreateDto): Promise<UUID> {
    await this._checkBlowsIds(createDto.correctBlowsCombinationIds);

    const model = new ToyoPersonaTrainingEventModel(createDto);

    const { id } = await this._repository.save(model);
    return id;
  }

  private async _checkBlowsIds(blowsIds: string[]) {
    try {
      for (const blowId of blowsIds) {
        await this._blowsService.getById(blowId);
      }
    } catch (error) {
      if (error instanceof NotFoundError)
        throw new ConstraintViolationError(error.message);
      throw error;
    }
  }
}
