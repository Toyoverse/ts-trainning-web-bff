import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import di from '../di';
import { HttpResponse } from 'src/utils/http/response';
import { TrainingEventCreateDto } from '../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from '../dto/training-event/get-current.dto';
import { TrainingEventService } from '../services/training-event.service';

@Controller('/training-events')
export class TrainingEventController {
  constructor(
    @Inject(di.TRAINING_EVENT_SERVICE)
    private trainingEventService: TrainingEventService,
  ) {}

  @Post()
  async create(@Body() body: TrainingEventCreateDto): Promise<HttpResponse> {
    const id = await this.trainingEventService.create(body);
    return new HttpResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training event successfully created',
      body: id,
    });
  }

  @Get('/search/current')
  getCurrent(): Promise<TrainingEventGetCurrentDto> {
    return this.trainingEventService.getCurrent();
  }
}
