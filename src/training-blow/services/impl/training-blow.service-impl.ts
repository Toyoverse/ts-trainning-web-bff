import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import di from 'src/training-blow/di';
import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { TrainingBlowGetByIdDto } from 'src/training-blow/dto/getbyid.dto';
import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepository } from 'src/training-blow/repositories/training-blow.repository';
import { UUID } from 'src/types/common';
import { TrainingBlowService } from '../training-blow.service';

@Injectable()
export class TrainingBlowServiceImpl implements TrainingBlowService {
  constructor(
    @Inject(di.TRAINING_BLOW_REPOSITORY)
    private _repository: TrainingBlowRepository,
  ) {}

  async create(dto: TrainingBlowCreateDto): Promise<UUID> {
    const model = new TrainingBlowModel(dto);
    const { id } = await this._repository.save(model);
    return id;
  }

  async getById(id: string): Promise<TrainingBlowGetByIdDto> {
    const model = await this._repository.getById(id);
    if (!model) {
      throw new NotFoundException('Training blow not found with id ' + id);
    }
    return model;
  }
}
