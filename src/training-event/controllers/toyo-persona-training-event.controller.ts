import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import di from '../di';
import { ToyoPersonaTrainingEventCreateDto } from '../dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventService } from '../services/toyo-persona-training-event.service';

@ApiTags('toyo-persona-training-events')
@Controller('toyo-persona-training-events')
export class ToyoPersonaTrainingEventController {
  constructor(
    @Inject(di.TOYO_PERSONA_TRAINING_EVENT_SERVICE)
    private _service: ToyoPersonaTrainingEventService,
  ) {}

  @ApiCreatedResponse({
    description: 'Toyo persona training event has been successfully created',
    type: () => CreateResponse,
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    type: () => ErrorResponse,
  })
  @Post()
  async create(
    @Body() createDto: ToyoPersonaTrainingEventCreateDto,
  ): Promise<CreateResponse> {
    const id = await this._service.create(createDto);
    return new CreateResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Toyo persona training event has been successfully created',
      body: id,
    });
  }
}
