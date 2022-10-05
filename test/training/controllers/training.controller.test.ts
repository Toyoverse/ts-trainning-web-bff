import 'reflect-metadata';
import { HttpStatus } from '@nestjs/common';
import { PlayerDto } from 'src/external/player/dto/player.dto';
import { TrainingController } from 'src/training/controllers/training.controller';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { TrainingStartRequestDto } from 'src/training/dto/training-start-request.dto';
import { TrainingService } from 'src/training/services/training.service';
import { CreateResponse } from 'src/utils/http/responses';

describe('TrainingController', () => {
  const trainingService: Partial<jest.Mocked<TrainingService>> = {
    start: jest.fn(),
    close: jest.fn(),
    list: jest.fn(),
    getResult: jest.fn(),
  };

  const trainingController = new TrainingController(trainingService as any);

  describe('Start training', () => {
    test('should return success', async () => {
      const currentPlayer = new PlayerDto({ id: '1' });

      const requestDto = new TrainingStartRequestDto({
        playerId: currentPlayer.id,
        combination: ['3', '2', '1'],
        toyoTokenId: 'tkWoczXeYJ',
        isAutomata: true,
      });

      const serviceResponse = new TrainingResponseDto({
        id: '1234',
        startAt: new Date('2022-02-02'),
        endAt: new Date('2022-02-07'),
        combination: ['1', '5', '4'],
        isAutomata: true,
      });

      trainingService.start.mockResolvedValue(serviceResponse);

      const expectedResponse = new CreateResponse({
        statusCode: HttpStatus.CREATED,
        message: 'Training successfully started',
        body: serviceResponse,
      });

      const response = await trainingController.start(
        currentPlayer,
        requestDto,
      );

      expect(response).toEqual(expectedResponse);
    });
  });
});
