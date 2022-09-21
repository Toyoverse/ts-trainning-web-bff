import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import di from '../di';
import { ToyoPersonaTrainingEventCreateDto } from '../dto/toyo-persona-training-event/create.dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from '../dto/toyo-persona-training-event/get-current.dto';
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

  @ApiQuery({ name: 'toyoPersona', description: 'Toyo persona id' })
  @ApiOkResponse({
    description: 'Current toyo persona training event succesfully returned',
    type: () => ToyoPersonaTrainingEventGetCurrentDto,
  })
  @ApiBadRequestResponse({
    description: 'There is no current toyo persona training event',
    type: () => ErrorResponse,
  })
  @Get('/search/current')
  getCurrent(
    @Query('toyoPersona') toyoPersonaId: string,
  ): Promise<ToyoPersonaTrainingEventGetCurrentDto> {
    return this._service.getCurrent(toyoPersonaId);
  }
}
