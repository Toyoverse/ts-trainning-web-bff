import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Get,
  Param,
  HttpStatus,
  Req,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentPlayerInterceptor } from 'src/interceptors/current-player.interceptor';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import di from '../di';
import { TrainingStartDto } from '../dto/start.dto';
import { TrainingService } from '../services/training.service';

@ApiTags('training')
@Controller('/training')
export class TrainingController {
  constructor(
    @Inject(di.TRAINING_SERVICE)
    private trainingService: TrainingService,
  ) {}

  @ApiCreatedResponse({
    description: 'Training successfully started',
    type: () => CreateResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred',
    type: () => ErrorResponse,
  })
  @UseInterceptors(CurrentPlayerInterceptor)
  @Post()
  async start(
    @Req() req: any,
    @Body() body: TrainingStartDto,
  ): Promise<CreateResponse> {
    body.playerId = req.player.id;

    const model = await this.trainingService.start(body);

    return new CreateResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training successfully started',
      body: model,
    });
  }

  @ApiQuery({ name: 'id', description: 'Training id' })
  @ApiOkResponse({
    description: 'Training successfully finished',
    type: () => CreateResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred',
    type: () => ErrorResponse,
  })
  @Put('/:id')
  async close(@Param('id') id: string): Promise<CreateResponse> {
    const model = await this.trainingService.close(id);

    return new CreateResponse({
      statusCode: HttpStatus.OK,
      message: 'Training successfully finished',
      body: model,
    });
  }

  @ApiOkResponse({
    description: 'Successfully retrieved player active trainings',
    type: () => CreateResponse,
  })
  @UseInterceptors(CurrentPlayerInterceptor)
  @Get()
  async list(@Req() req: any): Promise<CreateResponse> {
    const playerId = req.player.id;

    const trainings = await this.trainingService.list(playerId);

    return new CreateResponse({
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved player active trainings',
      body: trainings,
    });
  }
}
