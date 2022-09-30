import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import di from '../../di';
import toyoDi from 'src/external/toyo/di';
import playerDi from 'src/external/player/di';
import trainingEventDi from 'src/training-event/di';
import { TrainingRepository } from '../../../training/repositories/training.repository';
import { TrainingService } from '../training.service';
import { ToyoService } from 'src/external/toyo/services/toyo.service';
import { TrainingEventService } from 'src/training-event/services/training-event.service';
import { ToyoPersonaService } from 'src/external/toyo/services/toyo-persona.service';
import { ToyoPersonaTrainingEventService } from 'src/training-event/services/toyo-persona-training-event.service';
import { PlayerToyoService } from 'src/external/player/services/player-toyo.service';
import { ForbiddenError } from 'src/errors/forbidden.error';
import { TrainingStartRequestDto } from 'src/training/dto/training-start-request.dto';
import { TrainingModel } from 'src/training/models/training.model';
import {
  BadRequestError,
  ConstraintViolationError,
  InternalServerError,
  NotFoundError,
} from 'src/errors';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ListTrainingDto } from 'src/training/dto/list.dto';
import { arraysEquals } from 'src/utils/general/arrays';
import { classes } from 'src/config/back4app';

@Injectable()
export class TrainingServiceImpl implements TrainingService {
  readonly name = 'TrainingService';

  constructor(
    @Inject(di.TRAINING_REPOSITORY)
    private trainingRepository: TrainingRepository,
    @Inject(trainingEventDi.TRAINING_EVENT_SERVICE)
    private trainingEventService: TrainingEventService,
    @Inject(trainingEventDi.TOYO_PERSONA_TRAINING_EVENT_SERVICE)
    private toyoPersonaTrainingEventService: ToyoPersonaTrainingEventService,
    @Inject(playerDi.PLAYER_TOYO_SERVICE)
    private playerToyoService: PlayerToyoService,
    @Inject(toyoDi.TOYO_SERVICE)
    private toyoService: ToyoService,
    @Inject(toyoDi.TOYO_PERSONA_SERVICE)
    private toyoPersonaService: ToyoPersonaService,
  ) {}

  async start(dto: TrainingStartRequestDto): Promise<TrainingResponseDto> {
    try {
      const toyo = await this._getPlayerToyoByToken(
        dto.playerId,
        dto.toyoTokenId,
        dto.isAutomata,
      );

      this._checkOwnership(toyo);
      await this._checkIfToyoIsInTraining(toyo);

      const currentTrainingEvent = await this.trainingEventService.getCurrent();

      const blowConfig = this._getBlowConfig(
        currentTrainingEvent,
        dto.combination,
      );

      const startAt = new Date();
      const endAt = new Date(
        startAt.getTime() + blowConfig.duration * (60 * 1000),
      );

      const model = new TrainingModel({
        playerId: dto.playerId,
        toyoId: toyo.id,
        trainingEventId: currentTrainingEvent.id,
        startAt: startAt,
        endAt: endAt,
        combination: dto.combination,
        isTraining: true,
        isAutomata: dto.isAutomata,
      });

      const { id } = await this.trainingRepository.save(model);

      return new TrainingResponseDto({
        id,
        startAt,
        endAt,
        toyoTokenId: dto.toyoTokenId,
        combination: model.combination,
        isAutomata: model.isAutomata,
      });
    } catch (e) {
      if (e.name === Error.name || e.name === InternalServerError.name) {
        throw new InternalServerError(
          `Internal server error found when tried to start a training for toyo with token ${dto.toyoTokenId} owned by player ${dto.playerId} `,
          { cause: e.message, ctx: TrainingServiceImpl.name },
        );
      }

      throw e;
    }
  }

  private async _getPlayerToyoByToken(
    playerId: string,
    tokenId: string,
    isAutomata: boolean,
  ) {
    let toyos = [];

    if (!isAutomata) {
      toyos = await this.playerToyoService.getPlayerToyos(playerId);
    } else {
      toyos = await this.playerToyoService.getPlayerToyoAutomatas(playerId);
    }

    const [toyo] = toyos.filter((toyo) => toyo.tokenId === tokenId);
    return toyo;
  }

  private _checkOwnership(toyo: any) {
    if (!toyo) {
      throw new ForbiddenError('Access denied');
    }
  }

  private _getBlowConfig(
    currentTrainingEvent: TrainingEventGetCurrentDto,
    combination: string[],
  ) {
    const blowConfig = currentTrainingEvent.blowsConfig.find(
      (i) => i.qty === combination.length,
    );

    if (!blowConfig) {
      throw new ConstraintViolationError(
        'Blow config not found for the amount of blows',
      );
    }
    return blowConfig;
  }

  private async _checkIfToyoIsInTraining(toyo: any) {
    const isToyoAlreadyTraining =
      await this.trainingRepository.verifyIfToyoIsTraining(toyo.id);

    if (isToyoAlreadyTraining) {
      throw new ConstraintViolationError('Toyo already in training');
    }
  }

  // FIXME - handle exceptions more elegantly
  async getSignature(
    id: string,
    loggedPlayerId: string,
  ): Promise<TrainingResponseDto> {
    try {
      const training = await this.trainingRepository.getTrainingById(id);
      const playerId = training.get('player').id;

      if (!training || training.get('claimedAt') !== undefined) {
        throw new NotFoundException('Training not found or already claimed');
      }

      if (loggedPlayerId !== playerId) {
        throw new ForbiddenError(
          'You cannot close a training of toyo that you do not have',
        );
      }

      const toyoId = training.get('toyo').id;
      const toyo = await this.toyoService.getToyoById(toyoId);

      const toyoPersona = await this.toyoPersonaService.getById(
        toyo.get('toyoPersonaOrigin').id,
      );

      const trainingEvent = await this.trainingEventService.getById(
        training.get('trainingEvent').id,
      );

      const toyoPersonaTrainingEvent =
        await this.toyoPersonaTrainingEventService.getByTrainingEventAndPersona(
          trainingEvent.id,
          toyoPersona.id,
        );

      const model = await this.trainingRepository.getSignature(
        training,
        toyo,
        new Parse.Object(classes.TRAINING_EVENT, { id: trainingEvent.id }),
        toyoPersonaTrainingEvent,
      );

      return model;
    } catch (e) {
      if (e.name === Error.name || e.name === InternalServerError.name) {
        throw new InternalServerError(
          `Internal server error found when tried to close the training ${id} onwed by player ${loggedPlayerId} `,
          { cause: e.message, ctx: this.name },
        );
      }

      throw e;
    }
  }

  async close(
    id: string,
    loggedPlayerId: string,
  ): Promise<TrainingResponseDto> {
    try {
      let training = await this.trainingRepository.getById(id);

      if (!training) {
        throw new NotFoundError('Training not found with id ' + id, {
          ctx: this.name,
        });
      }

      if (loggedPlayerId !== training.playerId) {
        throw new ForbiddenError('Forbidden', { ctx: this.name });
      }

      if (!!training.claimedAt) {
        throw new BadRequestError('Training already claimed', {
          ctx: this.name,
        });
      }

      training.claimedAt = new Date();
      training.isTraining = false;

      training = await this.trainingRepository.save(training);

      const response = new TrainingResponseDto({
        ...training,
        signature: undefined,
      });

      return response;
    } catch (e) {
      if (e.name === Error.name || e.name === InternalServerError.name) {
        throw new InternalServerError(
          `Internal server error found when tried to close the training ${id} onwed by player ${loggedPlayerId} `,
          { cause: e.message, ctx: this.name },
        );
      }

      throw e;
    }
  }

  async list(playerId: string): Promise<ListTrainingDto[]> {
    const data = await this.trainingRepository.list(playerId);
    return data;
  }

  async getResult(
    id: string,
    loggedPlayerId: string,
  ): Promise<TrainingResponseDto> {
    try {
      const training = await this.trainingRepository.getById(id);

      if (!training) {
        throw new NotFoundError('Training not found');
      }

      if (loggedPlayerId !== training.playerId) {
        throw new ForbiddenError('Forbidden');
      }

      const toyo = await this.toyoService.getById(training.toyoId);

      const personaTrainingEvent =
        await this.toyoPersonaTrainingEventService.getByTrainingEventAndPersona(
          training.trainingEventId,
          toyo.personaId,
        );

      const eventCombination = personaTrainingEvent.combination;
      const playerCombination = training.combination;

      const combinationResult = this._getCombinationResult(
        playerCombination,
        eventCombination,
      );

      const trainingEvent = await this.trainingEventService.getById(
        training.trainingEventId,
      );

      const trainingBondReward = this._calculateBondReward(
        combinationResult.isCombinationCorrect,
        trainingEvent.bondReward,
        trainingEvent.bonusBondReward,
      );

      training.isCombinationCorrect = combinationResult.isCombinationCorrect;
      await this.trainingRepository.save(training);

      return new TrainingResponseDto({
        id: training.id,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        bond: trainingBondReward,
        toyoTokenId: toyo.tokenId,
        signature: undefined,
        combination: training.combination,
        isAutomata: false,
        card: personaTrainingEvent.cardReward,
        isCombinationCorrect: combinationResult.isCombinationCorrect,
        combinationResult: combinationResult.result,
      });
    } catch (e) {
      if (e.name === Error.name || e.name === InternalServerError.name) {
        throw new InternalServerError(
          `Internal server error found when tried to get result for training ${id} owned by player ${loggedPlayerId} `,
          { cause: e.message, ctx: TrainingServiceImpl.name },
        );
      }

      throw e;
    }
  }

  private _getCombinationResult(
    playerCombination: string[],
    eventCombination: string[],
  ) {
    const combination = {
      correct: eventCombination,
      user: playerCombination,
      result: [],
    };

    const userCombination = [...combination.correct];

    for (const [index, blow] of playerCombination.entries()) {
      const blowResult = { includes: false, position: false, blow };

      if (eventCombination.indexOf(blow) === index) {
        blowResult.position = true;
        blowResult.includes = true;
      } else if (userCombination.includes(blow)) {
        blowResult.includes = true;
        userCombination.splice(userCombination.indexOf(blow), 1);
      }

      combination.result.push(blowResult);
    }

    return {
      user: playerCombination,
      result: combination.result,
      isCombinationCorrect: arraysEquals(playerCombination, eventCombination),
    };
  }

  private _calculateBondReward(
    isCorrectCombination: boolean,
    bondReward: number,
    bonusBondReward: number,
  ) {
    if (isCorrectCombination) {
      return bondReward + bonusBondReward;
    }
    return bondReward;
  }
}
