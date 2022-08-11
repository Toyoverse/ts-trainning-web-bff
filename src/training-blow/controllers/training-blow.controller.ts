import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { HttpResponse } from 'src/utils/http/response';
import di from '../di';
import { TrainingBlowCreateDto } from '../dto/create.dto';
import { TrainingBlowService } from '../services/training-blow.service';

@Controller('/training-blows')
export class TrainingBlowController {
  constructor(
    @Inject(di.TRAINING_BLOW_SERVICE) private _service: TrainingBlowService,
  ) {}

  @Post()
  async create(@Body() dto: TrainingBlowCreateDto): Promise<HttpResponse> {
    const id = await this._service.create(dto);
    return new HttpResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training blow successfully created',
      body: id,
    });
  }
}
