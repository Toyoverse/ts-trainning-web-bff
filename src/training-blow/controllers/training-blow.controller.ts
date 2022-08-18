import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiHttpErrorFilter } from 'src/filters/error.filter';
import { HttpResponse } from 'src/utils/http/response';
import di from '../di';
import { TrainingBlowCreateDto } from '../dto/create.dto';
import { TrainingBlowGetByIdDto } from '../dto/getbyid.dto';
import { TrainingBlowService } from '../services/training-blow.service';

@Controller('/training-blows')
export class TrainingBlowController {
  constructor(
    @Inject(di.TRAINING_BLOW_SERVICE) private _service: TrainingBlowService,
  ) {}

  @UseFilters(new ApiHttpErrorFilter())
  @Post()
  async create(@Body() dto: TrainingBlowCreateDto): Promise<HttpResponse> {
    const id = await this._service.create(dto);
    return new HttpResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training blow successfully created',
      body: id,
    });
  }

  @Get('/:id')
  getById(@Param('id') id: string): Promise<TrainingBlowGetByIdDto> {
    return this._service.getById(id);
  }
}
