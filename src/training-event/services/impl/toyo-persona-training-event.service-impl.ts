import { Inject, Injectable } from '@nestjs/common';

import * as CryptoJS from 'crypto-js';

import di from 'src/training-event/di';
import trainingBlowsDi from 'src/training-blow/di';
import toyoDi from 'src/external/toyo/di';

import { ConstraintViolationError, NotFoundError } from 'src/errors';
import { UUID } from 'src/types/common';

import { ToyoPersonaService } from 'src/external/toyo/services/toyo-persona.service';
import { TrainingBlowService } from 'src/training-blow/services/training-blow.service';
import { ToyoPersonaTrainingEventRepository } from 'src/training-event/repositories/toyo-persona-training-event.repository';

import { ToyoPersonaTrainingEventService } from '../toyo-persona-training-event.service';
import { ToyoPersonaTrainingEventCreateDto } from 'src/training-event/dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventModel } from 'src/training-event/models/toyo-persona-training-event.model';
import { CardTrainingRewardModel } from 'src/training-event/models/card-training-reward.model';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { TrainingEventService } from '../training-event.service';
import { CardTrainingRewardService } from '../card-training-reward.service';

@Injectable()
export class ToyoPersonaTrainingEventServiceImpl
  implements ToyoPersonaTrainingEventService
{
  constructor(
    @Inject(di.TOYO_PERSONA_TRAINING_EVENT_REPOSITORY)
    private _repository: ToyoPersonaTrainingEventRepository,
    @Inject(di.TRAINING_EVENT_SERVICE)
    private _trainingEventService: TrainingEventService,
    @Inject(trainingBlowsDi.TRAINING_BLOW_SERVICE)
    private _blowsService: TrainingBlowService,
    @Inject(toyoDi.TOYO_PERSONA_SERVICE)
    private _toyoPersonaService: ToyoPersonaService,
    @Inject(di.CARD_TRAINING_REWARD_SERVICE)
    private _cardTrainingRewardService: CardTrainingRewardService,
  ) {}

  async create(input: ToyoPersonaTrainingEventCreateDto): Promise<UUID> {
    await this._checkPersona(input.toyoPersonaId);
    await this._checkBlowsIds(input.correctBlowsCombinationIds);

    const cardCode: string = CryptoJS.MD5(
      new Date().getTime().toString(),
    ).toString();

    input.cardReward.cardCode = cardCode;

    const model = new ToyoPersonaTrainingEventModel({
      ...input,
      cardReward: new CardTrainingRewardModel({ ...input.cardReward }),
    });

    const { id, cardReward } = await this._repository.save(model);

    await this._createCardMetadata(cardReward);

    return id;
  }

  private async _checkPersona(toyoPersonaId: string) {
    try {
      await this._toyoPersonaService.getById(toyoPersonaId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ConstraintViolationError(error.message);
      }
      throw error;
    }
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

  private _createCardMetadata(cardReward: CardTrainingRewardModel) {
    return this._cardTrainingRewardService.createMetadata(cardReward);
  }

  async getCurrent(
    toyoPersonaId: string,
  ): Promise<ToyoPersonaTrainingEventGetCurrentDto> {
    const trainingEvent = await this._trainingEventService.getCurrent();

    const model = await this._repository.getByTrainingEventAndToyoPersona(
      trainingEvent.id,
      toyoPersonaId,
    );

    if (!model) {
      throw new NotFoundError(
        'There is no current training event for toyo persona',
      );
    }
    return new ToyoPersonaTrainingEventGetCurrentDto(model as any);
  }

  async getToyoPersonaEventByEventId(
    toyoPersonaId: string,
    trainingEventId: string,
  ): Promise<ToyoPersonaTrainingEventGetCurrentDto> {
    const model = await this._repository.getByTrainingEventAndToyoPersona(
      trainingEventId,
      toyoPersonaId,
    );

    if (!model) {
      throw new NotFoundError(
        'There is no current training event for toyo persona',
      );
    }
    return new ToyoPersonaTrainingEventGetCurrentDto(model as any);
  }
}
