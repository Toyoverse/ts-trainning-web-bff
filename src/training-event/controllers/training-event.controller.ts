import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UUID } from 'src/types/common';
import di from '../di';
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
  createTrainingEvent(@Body() body: TrainingEventCreateDto): Promise<UUID> {
    return this.trainingEventService.create(body);
  }

  @Get('/search/current')
  getCurrent(): Promise<TrainingEventGetCurrentDto> {
    return this.trainingEventService.getCurrent();
  }
}
