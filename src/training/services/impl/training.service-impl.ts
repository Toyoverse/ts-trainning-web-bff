import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import di from '../../di';
import toyoDi from 'src/external/toyo/di';
import playerDi from 'src/external/player/di';
import trainingEventDi from 'src/training-event/di';
import { TrainingRepository } from '../../../training/repositories/training.repository';
import { TrainingService } from '../training.service';
import { TrainingStartDto } from '../../../training/dto/start.dto';
import { TrainingModel } from '../../../training/models/training.model';
import { PlayerService } from 'src/external/player/services/player.service';
import { ToyoService } from 'src/external/toyo/services/toyo.service';
import { TrainingEventService } from 'src/training-event/services/training-event.service';
import { ToyoPersonaService } from 'src/external/toyo/services/toyo-persona.service';
import { ToyoPersonaTrainingEventService } from 'src/training-event/services/toyo-persona-training-event.service';
import { ListTrainingDto } from 'src/training/dto/list.dto';
import { PlayerToyoService } from 'src/external/player/services/player-toyo.service';
import { ForbiddenError } from 'src/errors/forbidden.error';

@Injectable()
export class TrainingServiceImpl implements TrainingService {
  constructor(
    @Inject(di.TRAINING_REPOSITORY)
    private trainingRepository: TrainingRepository,
    @Inject(trainingEventDi.TRAINING_EVENT_SERVICE)
    private trainingEventService: TrainingEventService,
    @Inject(trainingEventDi.TOYO_PERSONA_TRAINING_EVENT_SERVICE)
    private toyoPersonaTrainingEventService: ToyoPersonaTrainingEventService,
    @Inject(playerDi.PLAYER_SERVICE)
    private playerService: PlayerService,
    @Inject(playerDi.PLAYER_TOYO_SERVICE)
    private playerToyoService: PlayerToyoService,
    @Inject(toyoDi.TOYO_SERVICE)
    private toyoService: ToyoService,
    @Inject(toyoDi.TOYO_PERSONA_SERVICE)
    private toyoPersonaService: ToyoPersonaService,
  ) {}

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const toyos = await this.playerToyoService.getPlayerToyos(dto.playerId);

    const [toyo] = toyos.filter((toyo) => toyo.tokenId === dto.toyoTokenId);
    if (!toyo) {
      throw new ForbiddenError(
        'You cannot start a training of toyo that you do not have',
      );
    }

    const isToyoAlreadyTraining =
      await this.trainingRepository.verifyIfToyoIsTraining(toyo.id);

    if (isToyoAlreadyTraining) {
      throw new BadRequestException(
        'You cannot start a training for a toyo that is already training',
      );
    }

    const currentTrainingEvent = await this.trainingEventService.getCurrent();

    const config = currentTrainingEvent.blowsConfig.find(
      (i) => i.qty === dto.combination.length,
    );

    if (!config) {
      throw new NotFoundException('Could not find the training config info');
    }

    const training = await this.trainingRepository.start(
      toyo.id,
      dto.playerId,
      currentTrainingEvent.id,
      config,
      dto.combination,
    );

    if (!training) {
      throw new InternalServerErrorException(
        'An error occurred while trying to start the training',
      );
    }

    return training;
  }

  async close(id: string, loggedPlayerId: string): Promise<TrainingModel> {
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
      await this.toyoPersonaTrainingEventService.getCurrent(toyoPersona.id);

    const model = await this.trainingRepository.close(
      training,
      toyo,
      trainingEvent,
      toyoPersonaTrainingEvent,
    );

    return model;
  }

  async list(playerId: string): Promise<ListTrainingDto[]> {
    const player = await this.playerService.getPlayerById(playerId);
    const toyos = await this.playerToyoService.getPlayerToyos(player.id);

    const data = await this.trainingRepository.list(player, toyos);

    return data;
  }

  async getResult(id: string, loggedPlayerId: string): Promise<TrainingModel> {
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
      await this.toyoPersonaTrainingEventService.getCurrent(toyoPersona.id);

    const model = await this.trainingRepository.getResult(
      training,
      trainingEvent,
      toyoPersonaTrainingEvent,
    );

    return model;
  }
}
