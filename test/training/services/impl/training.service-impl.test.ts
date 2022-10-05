import 'reflect-metadata';
import { when } from 'jest-when';
import { Eth } from 'web3-eth';
import { keccak256, toWei } from 'web3-utils';
import {
  BadRequestError,
  ConstraintViolationError,
  InternalServerError,
  NotFoundError,
} from 'src/errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth: ClassConstructor<Eth> = require('web3-eth');

import { BadGatewayError } from 'src/errors/bad-gateway.error';
import { ForbiddenError } from 'src/errors/forbidden.error';
import { PlayerToyoService } from 'src/external/player/services/player-toyo.service';
import { ToyoDto } from 'src/external/toyo/dto/toyo/dto';
import { ToyoService } from 'src/external/toyo/services/toyo.service';
import {
  CardTrainingRewardDto,
  ToyoPersonaTrainingEventDto,
} from 'src/training-event/dto/toyo-persona-training-event/dto';
import {
  BlowConfigDto,
  TrainingEventDto,
} from 'src/training-event/dto/training-event/dto';
import { BlowConfigGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ToyoPersonaTrainingEventService } from 'src/training-event/services/toyo-persona-training-event.service';
import { TrainingEventService } from 'src/training-event/services/training-event.service';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { TrainingStartRequestDto } from 'src/training/dto/training-start-request.dto';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepository } from 'src/training/repositories/training.repository';
import { TrainingServiceImpl } from 'src/training/services/impl/training.service-impl';
import { ClassConstructor } from 'class-transformer';
import { ListTrainingDto } from 'src/training/dto/list.dto';

const now = new Date('2020-01-01');
jest.useFakeTimers().setSystemTime(now);

jest.mock('web3-eth');
jest.mock('web3-utils');

process.env.PRIVATE_KEY = '0xfdalkfdalfad';

describe('Training service tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const trainingRepository: Partial<jest.Mocked<TrainingRepository>> = {
    getById: jest.fn(),
    getByPlayerAndInTraining: jest.fn(),
    save: jest.fn(),
    verifyIfToyoIsTraining: jest.fn(),
    checkIfToyoWonEventPreviosly: jest.fn(),
    resetPlayerTrainings: jest.fn(),
  };

  const trainingEventService: Partial<jest.Mocked<TrainingEventService>> = {
    getCurrent: jest.fn(),
    getById: jest.fn(),
  };

  const toyoPersonaTrainingEventService: Partial<
    jest.Mocked<ToyoPersonaTrainingEventService>
  > = {
    getByTrainingEventAndPersona: jest.fn(),
  };

  const playerToyoService: Partial<jest.Mocked<PlayerToyoService>> = {
    getPlayerToyos: jest.fn(),
    getPlayerToyoAutomatas: jest.fn(),
  };

  const toyoService: Partial<jest.Mocked<ToyoService>> = {
    getById: jest.fn(),
  };

  const trainingService = new TrainingServiceImpl(
    trainingRepository as any,
    trainingEventService as any,
    toyoPersonaTrainingEventService as any,
    playerToyoService as any,
    toyoService as any,
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
        new ToyoDto({
          id: toyoId,
          tokenId: requestDto.toyoTokenId,
          personaId: '1233f3',
        }),
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
        new ToyoDto({
          id: toyoId,
          tokenId: requestDto.toyoTokenId,
          personaId: '1233f3',
        }),
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
        .mockResolvedValue([
          new ToyoDto({
            id: 'fadfda',
            tokenId: 'dfafdab',
            personaId: '1233f3',
          }),
        ]);

      const t = async () => trainingService.start(dto);
      await expect(t).rejects.toThrow(ForbiddenError);
    });

    it('should throw error when try to start a training from a toyo that is already in training ', async () => {
      const dto = new TrainingStartRequestDto({ toyoTokenId: 'fdafda' } as any);

      const toyo = new ToyoDto({
        id: '123asd',
        tokenId: dto.toyoTokenId,
        personaId: '1233f3',
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
        personaId: '1233f3',
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

  describe('getSignature', () => {
    it('should return signature with card and bond reward plus bonus', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
        isCombinationCorrect: true,
      });

      const toyo = new ToyoDto({
        id: 'fildf',
        personaId: 'fi3lfav',
        tokenId: 'kgogfafad',
      });

      const trainingEvent = new TrainingEventDto({
        id: 'fdalfdaf',
        bondReward: 0.75,
        bonusBondReward: 1.25,
      } as any);

      const bondReward =
        trainingEvent.bondReward + trainingEvent.bonusBondReward;
      const formattedBondReward = bondReward + ' ETH';

      const cardReward = new CardTrainingRewardDto({
        id: '1',
        cardId: '1',
        description: '1',
        name: 'Tatsu training event card',
        imageUrl: 'https://www.images.com/card.jpeg',
        rotText: 'Lorem impsum',
        type: '1',
        cardCode: 'faç3fa',
      });

      const toyoPersonaTrainingEvent = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyo.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: cardReward,
        combination: ['1', '3', '7'],
      });

      const mockEthConstructor = jest.mocked(Web3Eth);

      const ethAbi = {
        encodeParameters: jest.fn(),
      };

      const ethAccounts = {
        sign: jest.fn(),
      };

      const eth = {
        abi: ethAbi,
        accounts: ethAccounts,
      };

      mockEthConstructor.mockReturnValue(eth as any);

      const mockKeccak256 = jest.mocked(keccak256);

      const mockKeccak256Msg = 'fl239fafda';
      mockKeccak256.mockReturnValueOnce(mockKeccak256Msg);

      const signature = '0xfdakl3faof3lvoad';

      when(trainingRepository.getById)
        .calledWith(trainingId)
        .mockResolvedValue(training);

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyo);

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEvent);

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyo.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEvent);

      when(toWei)
        .calledWith(bondReward.toString(), 'ether')
        .mockReturnValue(formattedBondReward);

      when(ethAccounts.sign)
        .calledWith(mockKeccak256Msg, process.env.PRIVATE_KEY)
        .mockReturnValue({ signature });

      const response = await trainingService.getSignature(trainingId, playerId);

      const expectedResponse = new TrainingResponseDto({
        id: training.id,
        combination: training.combination,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        isCombinationCorrect: training.isCombinationCorrect,
        isAutomata: training.isAutomata,
        toyoTokenId: toyo.tokenId,
        card: cardReward,
        bond: formattedBondReward,
        signature,
      });

      expect(response).toEqual(expectedResponse);

      expect(ethAbi.encodeParameters).toBeCalledWith(
        ['string', 'uint256', 'uint256', 'string'],
        [training.id, toyo.tokenId, formattedBondReward, cardReward.cardCode],
      );
    });

    it('should return signature with bond plus bonus and without card because toyo already won', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
        isCombinationCorrect: true,
      });

      const toyo = new ToyoDto({
        id: 'fildf',
        personaId: 'fi3lfav',
        tokenId: 'kgogfafad',
      });

      const trainingEvent = new TrainingEventDto({
        id: 'fdalfdaf',
        bondReward: 0.75,
        bonusBondReward: 1.25,
      } as any);

      const bondReward =
        trainingEvent.bondReward + trainingEvent.bonusBondReward;
      const formattedBondReward = bondReward + ' ETH';

      const cardReward = new CardTrainingRewardDto({
        id: '1',
        cardId: '1',
        description: '1',
        name: 'Tatsu training event card',
        imageUrl: 'https://www.images.com/card.jpeg',
        rotText: 'Lorem impsum',
        type: '1',
        cardCode: 'faç3fa',
      });

      const toyoPersonaTrainingEvent = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyo.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: cardReward,
        combination: ['1', '3', '7'],
      });

      const mockEthConstructor = jest.mocked(Web3Eth);

      const ethAbi = {
        encodeParameters: jest.fn(),
      };

      const ethAccounts = {
        sign: jest.fn(),
      };

      const eth = {
        abi: ethAbi,
        accounts: ethAccounts,
      };

      mockEthConstructor.mockReturnValue(eth as any);

      const mockKeccak256 = jest.mocked(keccak256);

      const mockKeccak256Msg = 'fl239fafda';
      mockKeccak256.mockReturnValueOnce(mockKeccak256Msg);

      const signature = '0xfdakl3faof3lvoad';

      when(trainingRepository.getById)
        .calledWith(trainingId)
        .mockResolvedValue(training);

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyo);

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEvent);

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyo.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEvent);

      when(trainingRepository.checkIfToyoWonEventPreviosly)
        .calledWith(
          training.trainingEventId,
          training.toyoId,
          training.isAutomata,
        )
        .mockResolvedValue(true);

      when(toWei)
        .calledWith(bondReward.toString(), 'ether')
        .mockReturnValue(formattedBondReward);

      when(ethAccounts.sign)
        .calledWith(mockKeccak256Msg, process.env.PRIVATE_KEY)
        .mockReturnValue({ signature });

      const response = await trainingService.getSignature(trainingId, playerId);

      const expectedResponse = new TrainingResponseDto({
        id: training.id,
        combination: training.combination,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        isCombinationCorrect: training.isCombinationCorrect,
        isAutomata: training.isAutomata,
        toyoTokenId: toyo.tokenId,
        card: undefined,
        bond: formattedBondReward,
        signature,
      });

      expect(response).toEqual(expectedResponse);

      expect(ethAbi.encodeParameters).toBeCalledWith(
        ['string', 'uint256', 'uint256', 'string'],
        [training.id, toyo.tokenId, formattedBondReward, ''],
      );
    });

    it('should return signature without card code because combination is not correct', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
        isCombinationCorrect: false,
      });

      const toyo = new ToyoDto({
        id: 'fildf',
        personaId: 'fi3lfav',
        tokenId: 'kgogfafad',
      });

      const trainingEvent = new TrainingEventDto({
        id: 'fdalfdaf',
        bondReward: 0.75,
        bonusBondReward: 1.25,
      } as any);

      const bondReward = trainingEvent.bondReward;
      const formattedBondReward = bondReward + ' ETH';

      const cardReward = new CardTrainingRewardDto({
        id: '1',
        cardId: '1',
        description: '1',
        name: 'Tatsu training event card',
        imageUrl: 'https://www.images.com/card.jpeg',
        rotText: 'Lorem impsum',
        type: '1',
        cardCode: 'faç3fa',
      });

      const toyoPersonaTrainingEvent = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyo.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: cardReward,
        combination: ['1', '3', '7'],
      });

      const mockEthConstructor = jest.mocked(Web3Eth);

      const ethAbi = {
        encodeParameters: jest.fn(),
      };

      const ethAccounts = {
        sign: jest.fn(),
      };

      const eth = {
        abi: ethAbi,
        accounts: ethAccounts,
      };

      mockEthConstructor.mockReturnValue(eth as any);

      const mockKeccak256 = jest.mocked(keccak256);

      const mockKeccak256Msg = 'fl239fafda';
      mockKeccak256.mockReturnValueOnce(mockKeccak256Msg);

      const signature = '0xfdakl3faof3lvoad';

      when(trainingRepository.getById)
        .calledWith(trainingId)
        .mockResolvedValue(training);

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyo);

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEvent);

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyo.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEvent);

      when(toWei)
        .calledWith(bondReward.toString(), 'ether')
        .mockReturnValue(formattedBondReward);

      when(ethAccounts.sign)
        .calledWith(mockKeccak256Msg, process.env.PRIVATE_KEY)
        .mockReturnValue({ signature });

      const response = await trainingService.getSignature(trainingId, playerId);

      const expectedResponse = new TrainingResponseDto({
        id: training.id,
        combination: training.combination,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        isCombinationCorrect: training.isCombinationCorrect,
        isAutomata: training.isAutomata,
        toyoTokenId: toyo.tokenId,
        card: undefined,
        bond: formattedBondReward,
        signature,
      });

      expect(response).toEqual(expectedResponse);

      expect(ethAbi.encodeParameters).toBeCalledWith(
        ['string', 'uint256', 'uint256', 'string'],
        [training.id, toyo.tokenId, formattedBondReward, ''],
      );
    });

    it('should throw not found error', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      trainingRepository.getById.mockResolvedValue(undefined);

      const t = async () => trainingService.getSignature(trainingId, playerId);

      await expect(t).rejects.toThrow(NotFoundError);
    });

    it('should forbid because logged player is not training owner', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId: 'f3fdfa',
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const t = async () => trainingService.getSignature(trainingId, playerId);

      await expect(t).rejects.toThrow(ForbiddenError);
    });

    it('should throw bad gateway if training toyo is not found', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);
      toyoService.getById.mockRejectedValue(new NotFoundError());

      const t = async () => trainingService.getSignature(trainingId, playerId);

      await expect(t).rejects.toThrow(BadGatewayError);
    });

    it('should throw internal server error if toyo persona training event is not found', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      const toyo = new ToyoDto({
        id: 'fildf',
        personaId: 'fi3lfav',
        tokenId: 'kgogfafad',
      });

      trainingRepository.getById.mockResolvedValue(training);
      toyoService.getById.mockResolvedValue(toyo);
      toyoPersonaTrainingEventService.getByTrainingEventAndPersona.mockRejectedValue(
        new NotFoundError(),
      );

      const t = async () => trainingService.getSignature(trainingId, playerId);

      await expect(t).rejects.toThrow(InternalServerError);
    });

    it('should throw internal server error if training event is not found', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      const toyo = new ToyoDto({
        id: 'fildf',
        personaId: 'fi3lfav',
        tokenId: 'kgogfafad',
      });

      trainingRepository.getById.mockResolvedValue(training);
      toyoService.getById.mockResolvedValue(toyo);
      trainingEventService.getById.mockRejectedValue(new NotFoundError());

      const t = async () => trainingService.getSignature(trainingId, playerId);

      await expect(t).rejects.toThrow(InternalServerError);
    });
  });

  describe('getResult', () => {
    it('should return result with card and bond plus bonus because combination is correct', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const toyoDto = new ToyoDto({
        id: training.toyoId,
        personaId: '1k3f89k',
        tokenId: '1233f3',
      });

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyoDto);

      const toyoPersonaTrainingEventDto = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyoDto.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: new CardTrainingRewardDto({
          id: '1',
          cardId: '1',
          description: '1',
          name: 'Tatsu training event card',
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText: 'Lorem impsum',
          type: '1',
        }),
        combination: ['1', '3', '7'],
      });

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyoDto.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEventDto);

      const trainingEventDto = new TrainingEventDto({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigDto({ duration: 3, qty: 5 }),
          new BlowConfigDto({ duration: 4, qty: 6 }),
        ],
      });

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEventDto);

      when(trainingRepository.checkIfToyoWonEventPreviosly)
        .calledWith(
          training.trainingEventId,
          training.toyoId,
          training.isAutomata,
        )
        .mockResolvedValue(false);

      const resp = await trainingService.getResult(trainingId, playerId);

      expect(trainingRepository.save).toBeCalledWith({
        ...training,
        isCombinationCorrect: true,
      });

      const expectedResp = new TrainingResponseDto({
        id: training.id,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        bond: trainingEventDto.bondReward + trainingEventDto.bonusBondReward,
        toyoTokenId: toyoDto.tokenId,
        signature: undefined,
        combination: training.combination,
        isAutomata: false,
        card: toyoPersonaTrainingEventDto.cardReward,
        isCombinationCorrect: true,
        combinationResult: [
          { blow: training.combination[0], position: true, includes: true },
          { blow: training.combination[1], position: true, includes: true },
          { blow: training.combination[2], position: true, includes: true },
        ],
      });

      expect(resp).toEqual(expectedResp);
    });

    it('should return result with just bond plus bonus because combination is correct and toyo already won event', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const toyoDto = new ToyoDto({
        id: training.toyoId,
        personaId: '1k3f89k',
        tokenId: '1233f3',
      });

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyoDto);

      const toyoPersonaTrainingEventDto = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyoDto.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: new CardTrainingRewardDto({
          id: '1',
          cardId: '1',
          description: '1',
          name: 'Tatsu training event card',
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText: 'Lorem impsum',
          type: '1',
        }),
        combination: ['1', '3', '7'],
      });

      const trainingEventDto = new TrainingEventDto({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigDto({ duration: 3, qty: 5 }),
          new BlowConfigDto({ duration: 4, qty: 6 }),
        ],
      });

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyoDto.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEventDto);

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEventDto);

      when(trainingRepository.checkIfToyoWonEventPreviosly)
        .calledWith(
          training.trainingEventId,
          training.toyoId,
          training.isAutomata,
        )
        .mockResolvedValue(true);

      const resp = await trainingService.getResult(trainingId, playerId);

      expect(trainingRepository.save).toBeCalledWith({
        ...training,
        isCombinationCorrect: true,
      });

      const expectedResp = new TrainingResponseDto({
        id: training.id,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        bond: trainingEventDto.bondReward + trainingEventDto.bonusBondReward,
        toyoTokenId: toyoDto.tokenId,
        signature: undefined,
        combination: training.combination,
        isAutomata: false,
        card: undefined,
        isCombinationCorrect: true,
        combinationResult: [
          { blow: training.combination[0], position: true, includes: true },
          { blow: training.combination[1], position: true, includes: true },
          { blow: training.combination[2], position: true, includes: true },
        ],
      });

      expect(resp).toEqual(expectedResp);
    });

    it('should return result with just bond because combination is incorrect', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '7'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const toyoDto = new ToyoDto({
        id: training.toyoId,
        personaId: '1k3f89k',
        tokenId: '1233f3',
      });

      when(toyoService.getById)
        .calledWith(training.toyoId)
        .mockResolvedValue(toyoDto);

      const toyoPersonaTrainingEventDto = new ToyoPersonaTrainingEventDto({
        id: 'f3f56g',
        toyoPersonaId: toyoDto.personaId,
        trainingEventId: training.trainingEventId,
        cardReward: new CardTrainingRewardDto({
          id: '1',
          cardId: '1',
          description: '1',
          name: 'Tatsu training event card',
          imageUrl: 'https://www.images.com/card.jpeg',
          rotText: 'Lorem impsum',
          type: '1',
        }),
        combination: ['2', '3', '1'],
      });

      when(toyoPersonaTrainingEventService.getByTrainingEventAndPersona)
        .calledWith(
          training.trainingEventId,
          toyoDto.personaId,
          training.isAutomata,
        )
        .mockResolvedValue(toyoPersonaTrainingEventDto);

      const trainingEventDto = new TrainingEventDto({
        name: 'Training Event',
        startAt: now,
        endAt: now,
        story:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod ante a ante sagittis ultricies.',
        bondReward: 0.75,
        bonusBondReward: 1.25,
        isOngoing: false,
        toyoTrainingConfirmationMessage:
          'Are you sure you want to start training?',
        inTrainingMessage: 'Training Doge',
        losesMessage: 'Sorry, you lost',
        rewardMessage: 'You won, congratulations',
        blows: ['1', '2', '3'],
        blowsConfig: [
          new BlowConfigDto({ duration: 3, qty: 5 }),
          new BlowConfigDto({ duration: 4, qty: 6 }),
        ],
      });

      when(trainingEventService.getById)
        .calledWith(training.trainingEventId)
        .mockResolvedValue(trainingEventDto);

      when(trainingRepository.checkIfToyoWonEventPreviosly)
        .calledWith(
          training.trainingEventId,
          training.toyoId,
          training.isAutomata,
        )
        .mockResolvedValue(false);

      const resp = await trainingService.getResult(trainingId, playerId);

      const expectedResp = new TrainingResponseDto({
        id: training.id,
        startAt: training.startAt,
        endAt: training.endAt,
        claimedAt: training.claimedAt,
        bond: trainingEventDto.bondReward,
        toyoTokenId: toyoDto.tokenId,
        signature: undefined,
        combination: training.combination,
        isAutomata: false,
        card: undefined,
        isCombinationCorrect: false,
        combinationResult: [
          { blow: training.combination[0], position: false, includes: true },
          { blow: training.combination[1], position: true, includes: true },
          { blow: training.combination[2], position: false, includes: false },
        ],
      });

      expect(resp).toEqual(expectedResp);
    });

    it('should throw not found error when training does not exist', async () => {
      const id = 't2fj3k';
      const playerId = '1fdlkjio';

      trainingRepository.getById.mockResolvedValue(undefined);

      const t = async () => trainingService.getResult(id, playerId);
      await expect(t).rejects.toThrow(NotFoundError);
    });

    it('should throw forbidden error when player tries to close a training that do not belong them', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId: '26587df',
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '5'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const t = async () => trainingService.getResult(trainingId, playerId);

      await expect(t).rejects.toThrow(ForbiddenError);
    });
  });

  describe('close', () => {
    it('should close training', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId: playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: undefined,
        combination: ['1', '3', '5'],
        isTraining: true,
        isAutomata: false,
        signature: 'flk3zx3fgdfalkfda',
      });

      const trainingAfterClose = new TrainingModel({
        ...training,
        claimedAt: new Date(),
        isTraining: false,
      });

      trainingRepository.getById.mockResolvedValue(training);
      trainingRepository.save.mockResolvedValue(trainingAfterClose);

      const resp = await trainingService.close(trainingId, playerId);

      expect(trainingRepository.save).toBeCalledWith(trainingAfterClose);

      const expectedResponse = new TrainingResponseDto({
        ...trainingAfterClose,
        signature: undefined,
      });
      expect(resp).toEqual(expectedResponse);
    });

    it('should throw not found error when training does not exist', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      trainingRepository.getById.mockResolvedValue(undefined);

      const t = async () => trainingService.close(trainingId, playerId);

      await expect(t).rejects.toThrow(NotFoundError);
    });

    it('should throw forbidden error when player tries to close a training that do not belong them', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId: '26587df',
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '5'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const t = async () => trainingService.close(trainingId, playerId);

      await expect(t).rejects.toThrow(ForbiddenError);
    });

    it('should throw bad request error when training is already claimed', async () => {
      const trainingId = 'sfgek3lç';
      const playerId = 'k3iffjlk';

      const training = new TrainingModel({
        id: trainingId,
        playerId: playerId,
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: new Date(2022, 2, 2, 17),
        combination: ['1', '3', '5'],
        isTraining: false,
        isAutomata: false,
      });

      trainingRepository.getById.mockResolvedValue(training);

      const t = async () => trainingService.close(trainingId, playerId);

      await expect(t).rejects.toThrow(
        new BadRequestError('Training already claimed'),
      );
    });
  });

  describe('list', () => {
    it('should return player trainings', async () => {
      const playerId = 'fadfalfdafd';
      const expectedResponse = [
        new ListTrainingDto({
          id: 'fadfad',
          combination: ['1', '2', '3'],
          startAt: new Date(2022, 2, 2, 2),
          endAt: new Date(2022, 2, 2, 2),
          claimedAt: new Date(2022, 2, 2, 2),
          isAutomata: true,
        }),
        new ListTrainingDto({
          id: 'favbabaf',
          combination: ['1', '2', '3'],
          startAt: new Date(2022, 2, 2, 2),
          endAt: new Date(2022, 2, 2, 2),
          claimedAt: new Date(2022, 2, 2, 2),
          isAutomata: true,
        }),
      ];

      when(trainingRepository.getByPlayerAndInTraining)
        .calledWith(playerId)
        .mockImplementation(async () => {
          const models = [];
          for (const dto of expectedResponse) {
            const model = new TrainingModel({
              id: dto.id,
              playerId,
              toyoId: '1234f',
              trainingEventId: 'fk3lkls',
              startAt: dto.startAt,
              endAt: dto.endAt,
              claimedAt: dto.claimedAt,
              combination: dto.combination,
              isTraining: false,
              isAutomata: dto.isAutomata,
              isCombinationCorrect: true,
            });

            models.push(model);
          }
          return models;
        });

      const response = await trainingService.list(playerId);

      expect(response).toEqual(expectedResponse);
    });
  });
});
