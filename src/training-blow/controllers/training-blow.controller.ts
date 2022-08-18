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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import di from '../di';
import { TrainingBlowCreateDto } from '../dto/create.dto';
import { TrainingBlowGetByIdDto } from '../dto/getbyid.dto';
import { TrainingBlowService } from '../services/training-blow.service';

@ApiTags('training-blows')
@Controller('/training-blows')
export class TrainingBlowController {
  constructor(
    @Inject(di.TRAINING_BLOW_SERVICE) private _service: TrainingBlowService,
  ) {}

  @UseFilters(new ApiHttpErrorFilter())
  @ApiCreatedResponse({
    description: 'The training blow has been succesfully created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: () => ErrorResponse,
  })
  @Post()
  async create(
    @Body() dto: TrainingBlowCreateDto,
  ): Promise<Promise<CreateResponse>> {
    const id = await this._service.create(dto);
    return new CreateResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training blow successfully created',
      body: id,
    });
  }

  @ApiOkResponse({
    description: 'Returns a training blow that matches id',
    type: () => TrainingBlowGetByIdDto,
  })
  @ApiNotFoundResponse({
    description: 'There is no training blow that matches id',
    type: () => ErrorResponse,
  })
  @Get('/:id')
  getById(@Param('id') id: string): Promise<TrainingBlowGetByIdDto> {
    return this._service.getById(id);
  }
}
