import { when } from 'jest-when';
import 'reflect-metadata';
import { ConstraintViolationError } from 'src/errors';
import { ForbiddenError } from 'src/errors/forbidden.error';
import { ToyoDto } from 'src/external/player/dto/toyo.dto';
import { PlayerToyoService } from 'src/external/player/services/player-toyo.service';
import { BlowConfigGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { TrainingEventService } from 'src/training-event/services/training-event.service';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { TrainingStartRequestDto } from 'src/training/dto/training-start-request.dto';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepository } from 'src/training/repositories/training.repository';
import { TrainingServiceImpl } from 'src/training/services/impl/training.service-impl';

const now = new Date('2020-01-01');
jest.useFakeTimers().setSystemTime(now);

describe('Training service tests', () => {
  const trainingRepository: Partial<jest.Mocked<TrainingRepository>> = {
    save: jest.fn(),
    verifyIfToyoIsTraining: jest.fn(),
    start: jest.fn(),
    close: jest.fn(),
    list: jest.fn(),
  };

  const trainingEventService: Partial<jest.Mocked<TrainingEventService>> = {
    getCurrent: jest.fn(),
  };

  const toyoPersonaTrainingEventService = {};

  const playerToyoService: Partial<jest.Mocked<PlayerToyoService>> = {
    getPlayerToyos: jest.fn(),
    getPlayerToyoAutomatas: jest.fn(),
  };

  const toyoService = {};
  const toyoPersonaService = {};

  const trainingService = new TrainingServiceImpl(
    trainingRepository as any,
    trainingEventService as any,
    toyoPersonaTrainingEventService as any,
    playerToyoService as any,
    toyoService as any,
    toyoPersonaService as any,
  );

  const now = new Date();

  describe('start', () => {
    it('should start a training for a toyo', async () => {
      const requestDto = new TrainingStartRequestDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoTokenId: 'tkWoczXeYJ',
        isAutomata: false,
      });

      const blowsConfig = [
        new BlowConfigGetCurrentDto({ duration: 60, qty: 3 }),
      ];

      const [blowConfig] = blowsConfig;

      const toyoId = 'f3gh4ff';
      const currentTrainingEventId = 'fda2cda3';
      const startAt = now;

      const endAt = new Date(
        startAt.getTime() + blowConfig.duration * (60 * 1000),
      );

      const model = new TrainingModel({
        playerId: requestDto.playerId,
        toyoId: toyoId,
        trainingEventId: currentTrainingEventId,
        startAt,
        endAt,
        combination: requestDto.combination,
        isTraining: true,
        isAutomata: requestDto.isAutomata,
      });

      playerToyoService.getPlayerToyos.mockResolvedValue([
        new ToyoDto({ id: toyoId, tokenId: requestDto.toyoTokenId }),
      ]);

      trainingEventService.getCurrent.mockResolvedValue({
        id: currentTrainingEventId,
        blowsConfig,
      } as any);

      const mockId = '3f8gdl3ei';
      trainingRepository.save.mockImplementation(async (model) => {
        return { ...model, id: mockId };
      });

      const response = await trainingService.start(requestDto);

      expect(trainingRepository.save).toBeCalledWith(model);

      const expectedResponse = new TrainingResponseDto({
        id: mockId,
        startAt,
        endAt,
        toyoTokenId: requestDto.toyoTokenId,
        combination: requestDto.combination,
        isAutomata: requestDto.isAutomata,
      });

      expect(response).toEqual(expectedResponse);
    });

    it('should start a training for a automata', async () => {
      const requestDto = new TrainingStartRequestDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoTokenId: 'tkWoczXeYJ',
        isAutomata: true,
      });

      const blowsConfig = [
        new BlowConfigGetCurrentDto({ duration: 60, qty: 3 }),
      ];

      const [blowConfig] = blowsConfig;

      const toyoId = 'f3gh4ff';
      const currentTrainingEventId = 'fda2cda3';
      const startAt = now;

      const endAt = new Date(
        startAt.getTime() + blowConfig.duration * (60 * 1000),
      );

      const model = new TrainingModel({
        playerId: requestDto.playerId,
        toyoId: toyoId,
        trainingEventId: currentTrainingEventId,
        startAt,
        endAt,
        combination: requestDto.combination,
        isTraining: true,
        isAutomata: requestDto.isAutomata,
      });

      playerToyoService.getPlayerToyoAutomatas.mockResolvedValue([
        new ToyoDto({ id: toyoId, tokenId: requestDto.toyoTokenId }),
      ]);

      trainingEventService.getCurrent.mockResolvedValue({
        id: currentTrainingEventId,
        blowsConfig,
      } as any);

      const mockId = '3f8gdl3ei';
      trainingRepository.save.mockImplementation(async (model) => {
        return { ...model, id: mockId };
      });

      const response = await trainingService.start(requestDto);

      expect(trainingRepository.save).toBeCalledWith(model);

      const expectedResponse = new TrainingResponseDto({
        id: mockId,
        startAt,
        endAt,
        toyoTokenId: requestDto.toyoTokenId,
        combination: requestDto.combination,
        isAutomata: requestDto.isAutomata,
      });

      expect(response).toEqual(expectedResponse);
    });

    it('should forbid start a new training from a toyo that do not belong to the user', async () => {
      const dto = new TrainingStartRequestDto({
        playerId: 'SJhHPvzbw7',
        combination: ['3', '2', '1'],
        toyoTokenId: 'tkWoczXeYJ',
        isAutomata: false,
      });

      when(playerToyoService.getPlayerToyos)
        .calledWith(dto.playerId)
        .mockResolvedValue([new ToyoDto({ id: 'fadfda', tokenId: 'dfafdab' })]);

      const t = async () => trainingService.start(dto);
      await expect(t).rejects.toThrow(ForbiddenError);
    });

    it('should throw error when try to start a training from a toyo that is already in training ', async () => {
      const dto = new TrainingStartRequestDto({ toyoTokenId: 'fdafda' } as any);

      const toyo = new ToyoDto({
        id: '123asd',
        tokenId: dto.toyoTokenId,
      });

      playerToyoService.getPlayerToyos.mockResolvedValue([toyo]);

      when(trainingRepository.verifyIfToyoIsTraining)
        .calledWith(toyo.id)
        .mockResolvedValue(true);

      const expectedError = new ConstraintViolationError(
        'Toyo already in training',
      );

      const t = async () => trainingService.start(dto);
      await expect(t).rejects.toThrow(expectedError);
    });

    it('should throw error when cannot find a blow config for the quantity of blows', async () => {
      const dto = new TrainingStartRequestDto({
        toyoTokenId: 'fdafda',
        combination: ['1', '2'],
      } as any);

      const toyo = new ToyoDto({
        id: '123asd',
        tokenId: dto.toyoTokenId,
      });

      playerToyoService.getPlayerToyos.mockResolvedValue([toyo]);
      trainingRepository.verifyIfToyoIsTraining.mockResolvedValue(false);

      const blowsConfig = [
        new BlowConfigGetCurrentDto({ duration: 60, qty: 3 }),
      ];

      trainingEventService.getCurrent.mockResolvedValue({
        blowsConfig,
      } as any);

      const expectedError = new ConstraintViolationError(
        'Blow config not found for the amount of blows',
      );

      const t = async () => trainingService.start(dto);
      await expect(t).rejects.toThrow(expectedError);
    });
  });
});
