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
    @Inject(toyoDi.TOYO_SERVICE)
    private toyoService: ToyoService,
    @Inject(toyoDi.TOYO_PERSONA_SERVICE)
    private toyoPersonaService: ToyoPersonaService,
  ) {}

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const player = await this.playerService.getPlayerById(dto.playerId);
    const toyo = await this.toyoService.getToyoByTokenId(dto.toyoTokenId);

    const isToyoAlreadyTraining =
      await this.trainingRepository.verifyIfToyoIsTraining(toyo);

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
      toyo,
      player,
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

  async close(id: string): Promise<TrainingModel> {
    const training = await this.trainingRepository.getTrainingById(id);

    if (!training || training.get('claimedAt') !== undefined) {
      throw new NotFoundException('Training not found or already claimed');
    }

    const toyoId = training.get('toyo').id;
    const toyo = await this.toyoService.getToyoById(toyoId);

    const toyoPersona = await this.toyoPersonaService.getById(
      toyo.get('toyoPersonaOrigin').id,
    );

    const currentTrainingEvent = await this.trainingEventService.getCurrent();

    const toyoPersonaTrainingEvent =
      await this.toyoPersonaTrainingEventService.getCurrent(toyoPersona.id);

    const model = await this.trainingRepository.close(
      training,
      toyo,
      currentTrainingEvent,
      toyoPersonaTrainingEvent,
    );
    return model;
  }

  async list(playerId: string): Promise<TrainingModel[]> {
    const player = await this.playerService.getPlayerById(playerId);

    const data = await this.trainingRepository.list(player);

    return data;
  }
}
