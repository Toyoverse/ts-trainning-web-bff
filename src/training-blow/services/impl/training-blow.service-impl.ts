import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConstraintViolationError } from 'src/errors';
import { NotFoundError } from 'src/errors/not-found.error';

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
    const existingModelWithId = await this._repository.getById(dto.id);
    if (existingModelWithId) {
      throw new ConstraintViolationError(
        `Training blow with id ${dto.id} already exists`,
      );
    }

    const model = new TrainingBlowModel(dto);
    const { id } = await this._repository.save(model);
    return id;
  }

  async getById(id: string): Promise<TrainingBlowGetByIdDto> {
    const model = await this._repository.getById(id);
    if (!model) {
      throw new NotFoundError('Training blow not found with id ' + id);
    }
    return model;
  }
}
