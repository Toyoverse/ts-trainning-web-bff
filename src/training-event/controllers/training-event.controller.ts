import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import di from '../di';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import { TrainingEventCreateDto } from '../dto/training-event/create.dto';
import { TrainingEventGetCurrentDto } from '../dto/training-event/get-current.dto';
import { TrainingEventService } from '../services/training-event.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('training-events')
@Controller('/training-events')
export class TrainingEventController {
  constructor(
    @Inject(di.TRAINING_EVENT_SERVICE)
    private trainingEventService: TrainingEventService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The training event has been succesfully created.',
    type: () => CreateResponse,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
    type: () => ErrorResponse,
  })
  async create(@Body() body: TrainingEventCreateDto): Promise<CreateResponse> {
    const id = await this.trainingEventService.create(body);
    return new CreateResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training event successfully created',
      body: id,
    });
  }

  @Get('/search/current')
  @ApiOkResponse({
    description: 'Returns current training event',
    type: TrainingEventGetCurrentDto,
  })
  @ApiNotFoundResponse({
    description: 'There is no current training event',
    type: () => ErrorResponse,
  })
  getCurrent(): Promise<TrainingEventGetCurrentDto> {
    return this.trainingEventService.getCurrent();
  }
}
