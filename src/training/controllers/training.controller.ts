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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentPlayer } from 'src/decorators/current-player.decorator';
import { PlayerDto } from 'src/external/player/dto/player.dto';
import { CurrentPlayerInterceptor } from 'src/interceptors/current-player.interceptor';
import { CreateResponse, ErrorResponse } from 'src/utils/http/responses';
import di from '../di';
import { TrainingStartRequestDto } from '../dto/training-start-request.dto';
import { TrainingService } from '../services/training.service';

@ApiTags('training')
@Controller('/training')
@UseInterceptors(CurrentPlayerInterceptor)
export class TrainingController {
  constructor(
    @Inject(di.TRAINING_SERVICE)
    private trainingService: TrainingService,
  ) {}

  @ApiCreatedResponse({
    description: 'Training successfully started',
    type: () => CreateResponse,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: () => ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred',
    type: () => ErrorResponse,
  })
  @Post()
  async start(
    @CurrentPlayer() player: PlayerDto,
    @Body() body: TrainingStartRequestDto,
  ): Promise<CreateResponse> {
    body.playerId = player.id;

    const responseDto = await this.trainingService.start(body);

    return new CreateResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Training successfully started',
      body: responseDto,
    });
  }

  @ApiQuery({ name: 'id', description: 'Training id' })
  @ApiOkResponse({
    description: 'Training successfully finished',
    type: () => CreateResponse,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: () => ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'An error occurred',
    type: () => ErrorResponse,
  })
  @Put('/:id')
  async close(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<CreateResponse> {
    const playerId = req.player.id;
    const model = await this.trainingService.close(id, playerId);

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

  @ApiOkResponse({
    description: 'Successfully retrieved training result',
    type: () => CreateResponse,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    type: () => ErrorResponse,
  })
  @Get('/:id')
  async getResult(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<CreateResponse> {
    const playerId = req.player.id;
    const result = await this.trainingService.getResult(id, playerId);

    return new CreateResponse({
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved training result',
      body: result,
    });
  }
}
