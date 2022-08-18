import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Get,
  Param,
} from '@nestjs/common';
import di from '../di';
import { TrainingStartDto } from '../dto/start.dto';
import { TrainingService } from '../services/training.service';

@Controller('/training')
export class TrainingController {
  constructor(
    @Inject(di.TRAINING_SERVICE)
    private trainingService: TrainingService,
  ) {}

  @Post()
  start(@Body() body: TrainingStartDto): Promise<any> {
    return this.trainingService.start(body);
  }

  @Put('/:id')
  close(@Param('id') id: string): Promise<any> {
    return this.trainingService.close(id);
  }

  @Get()
  list(): Promise<any> {
    return this.trainingService.list();
  }
}
