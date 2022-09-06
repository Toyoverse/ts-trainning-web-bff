import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import di from '../../di';
import { TrainingRepository } from '../../../training/repositories/training.repository';
import { TrainingService } from '../training.service';
import { TrainingStartDto } from '../../../training/dto/start.dto';
import { TrainingModel } from '../../../training/models/training.model';
import { PlayerService } from 'src/external/player/services/player.service';

@Injectable()
export class TrainingServiceImpl implements TrainingService {
  constructor(
    @Inject(di.TRAINING_REPOSITORY)
    private trainingRepository: TrainingRepository,
    @Inject(di.PLAYER_SERVICE)
    private playerService: PlayerService,
  ) {}

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const model = await this.trainingRepository.start(dto);

    if (!model) {
      throw new InternalServerErrorException('An error occurred');
    }

    return model;
  }

  async close(id: string): Promise<TrainingModel> {
    const model = await this.trainingRepository.close(id);
    return model;
  }

  async list(playerId: string): Promise<TrainingModel[]> {
    const player = await this.playerService.getPlayerById(playerId);

    if (!player) {
      throw new NotFoundException('Player not found');
    }

    const data = await this.trainingRepository.list(player);

    return data;
  }
}
