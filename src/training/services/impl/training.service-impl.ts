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
import { ConstraintViolationError, InternalServerError } from 'src/errors';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ListTrainingDto } from 'src/training/dto/list.dto';

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
    // FIXME - handle exceptions more elegantly
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
  async close(
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
        await this.toyoPersonaTrainingEventService.getToyoPersonaEventByEventId(
          toyoPersona.id,
          trainingEvent.id,
        );

      const model = await this.trainingRepository.close(
        training,
        toyo,
        trainingEvent,
        toyoPersonaTrainingEvent,
      );

      return model;
    } catch (e) {
      if (e.name === Error.name || e.name === InternalServerError.name) {
        throw new InternalServerError(
          `Internal server error found when tried to close the training ${id} onwed by player ${loggedPlayerId} `,
          { cause: e.message, ctx: TrainingServiceImpl.name },
        );
      }

      throw e;
    }
  }

  async list(playerId: string): Promise<ListTrainingDto[]> {
    const toyos = await this.playerToyoService.getPlayerToyos(playerId);
    const data = await this.trainingRepository.list(playerId, toyos);
    return data;
  }

  async getResult(
    id: string,
    loggedPlayerId: string,
  ): Promise<TrainingResponseDto> {
    try {
      const training = await this.trainingRepository.getTrainingById(id);

      if (!training) {
        throw new NotFoundException('Training not found');
      }

      const playerId = training.get('player').id;

      if (loggedPlayerId !== playerId) {
        throw new ForbiddenError(
          'You cannot get the training result of toyo that you do not have',
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
        await this.toyoPersonaTrainingEventService.getToyoPersonaEventByEventId(
          toyoPersona.id,
          trainingEvent.id,
        );

      const model = await this.trainingRepository.getResult(
        training,
        trainingEvent,
        toyoPersonaTrainingEvent,
      );

      return model;
    } catch (e) {
      if (e instanceof InternalServerError || e instanceof Error) {
        throw new InternalServerError(
          `Internal server error found when tried to get result for training ${id} owned by player ${loggedPlayerId} `,
          { cause: e.message, ctx: TrainingServiceImpl.name },
        );
      }

      throw e;
    }
  }
}
