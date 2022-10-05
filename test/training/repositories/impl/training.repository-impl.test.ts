import { expectCt } from 'helmet';
import { when } from 'jest-when';
import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepositoryImpl } from 'src/training/repositories/impl/training.repository-impl';

jest.mock('parse/node');

describe('TrainingRepositoryImpl', () => {
  const repository = new TrainingRepositoryImpl();

  describe('getById', () => {
    it('should return training', async () => {
      const id = 'dfef9ef';

      const expectedResponse = new TrainingModel({
        id: id,
        playerId: 'pl3fls',
        toyoId: '1234f',
        trainingEventId: 'fk3lkls',
        startAt: new Date(2022, 2, 2, 12),
        endAt: new Date(2022, 2, 2, 16),
        claimedAt: undefined,
        combination: ['1', '3', '5'],
        isTraining: true,
        isAutomata: false,
        signature: 'flk3zx3fgdfalkfda',
        isCombinationCorrect: true,
      });

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockParseQuery: Partial<jest.Mocked<Parse.Query>> = {
        equalTo: jest.fn(),
        first: jest.fn(),
      };

      when(mockParseQueryConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockParseQuery as any);

      const mockParseObject = {
        id,
        get: jest.fn(),
      };

      mockParseQuery.first.mockResolvedValue(mockParseObject as any);

      when(mockParseObject.get)
        .calledWith('trainingEvent')
        .mockReturnValue({ id: expectedResponse.trainingEventId });

      when(mockParseObject.get)
        .calledWith('player')
        .mockReturnValue({ id: expectedResponse.playerId });

      when(mockParseObject.get)
        .calledWith('toyo')
        .mockReturnValue({ id: expectedResponse.toyoId });

      when(mockParseObject.get)
        .calledWith('startAt')
        .mockReturnValue(expectedResponse.startAt);

      when(mockParseObject.get)
        .calledWith('endAt')
        .mockReturnValue(expectedResponse.endAt);

      when(mockParseObject.get)
        .calledWith('claimedAt')
        .mockReturnValue(expectedResponse.claimedAt);

      when(mockParseObject.get)
        .calledWith('signature')
        .mockReturnValue(expectedResponse.signature);

      when(mockParseObject.get)
        .calledWith('combination')
        .mockReturnValue(expectedResponse.combination);

      when(mockParseObject.get)
        .calledWith('combinationCorrect')
        .mockReturnValue(expectedResponse.isCombinationCorrect);

      when(mockParseObject.get)
        .calledWith('isTraining')
        .mockReturnValue(expectedResponse.isTraining);

      when(mockParseObject.get)
        .calledWith('isAutomata')
        .mockReturnValue(expectedResponse.isAutomata);

      const resp = await repository.getById(id);

      expect(mockParseQuery.equalTo).toBeCalledWith('objectId', id);
      expect(resp).toEqual(expectedResponse);
    });
  });

  describe('getByPlayerAndInTraining', () => {
    it('should return trainings', async () => {
      const playerId = 'flevjv';

      const expectedModels = [
        new TrainingModel({
          id: '125fa',
          playerId,
          toyoId: '1234f',
          trainingEventId: 'fk3lkls',
          startAt: new Date(2022, 2, 2, 12),
          endAt: new Date(2022, 2, 2, 16),
          claimedAt: undefined,
          combination: ['1', '3', '5'],
          isTraining: true,
          isAutomata: false,
          signature: 'flk3zx3fgdfalkfda',
          isCombinationCorrect: true,
        }),
        new TrainingModel({
          id: 'gba3fa',
          playerId,
          toyoId: 'fafda',
          trainingEventId: 'gae3fa',
          startAt: new Date(2022, 2, 2, 12),
          endAt: new Date(2022, 2, 2, 16),
          claimedAt: undefined,
          combination: ['1', '3', '5'],
          isTraining: true,
          isAutomata: true,
          signature: 'fagage4afgafda',
          isCombinationCorrect: false,
        }),
      ];

      const mockParseQueryConstructor = jest.mocked(Parse.Query);

      const mockParseQuery = {
        equalTo: jest.fn(),
        find: jest.fn(),
      };

      when(mockParseQueryConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockParseQuery as any);

      const mockParseObjectConstructor = jest.mocked(Parse.Object);

      const mockPlayerParseObject = {
        id: playerId,
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.PLAYERS, {
          id: playerId,
        })
        .mockReturnValue(mockPlayerParseObject as any);

      mockParseQuery.find.mockImplementation(() => {
        const objects = [];

        for (const model of expectedModels) {
          const object = {
            id: model.id,
            get: (key: string) => {
              switch (key) {
                case 'player':
                  return { id: model.playerId };
                case 'trainingEvent':
                  return { id: model.trainingEventId };
                case 'toyo':
                  return { id: model.toyoId };
                case 'startAt':
                  return model.startAt;
                case 'endAt':
                  return model.endAt;
                case 'claimAt':
                  return model.claimedAt;
                case 'combination':
                  return model.combination;
                case 'isTraining':
                  return model.isTraining;
                case 'isAutomata':
                  return model.isAutomata;
                case 'signature':
                  return model.signature;
                case 'combinationCorrect':
                  return model.isCombinationCorrect;
              }
            },
          };
          objects.push(object);
        }

        return objects;
      });

      const response = await repository.getByPlayerAndInTraining(playerId);

      expect(mockParseQuery.equalTo).toBeCalledWith(
        'player',
        mockPlayerParseObject,
      );

      expect(mockParseQuery.equalTo).toBeCalledWith('isTraining', true);

      expect(response).toEqual(expectedModels);
    });
  });
  describe('save', () => {
    it('should save', async () => {
      const id = 'dfef9ef';

      const trainingModel = new TrainingModel({
        id,
        playerId: '34dr32f',
        toyoId: '3473jkl',
        trainingEventId: '23fkell',
        startAt: new Date(2022, 3, 2, 2),
        endAt: new Date(2022, 3, 2, 8),
        combination: ['1', '2', '4'],
        isTraining: true,
        isAutomata: true,
      });

      const mockParseObjectConstructor = jest.mocked(Parse.Object);

      const mockTrainingParseObject = {
        id: undefined,
        set: jest.fn(),
        save: jest.fn(),
      };

      const mockTrainingEventParseObject = {
        id: trainingModel.trainingEventId,
      };

      const mockPlayerParseObject = {
        id: trainingModel.playerId,
      };

      const mockToyoParseObject = {
        id: trainingModel.toyoId,
      };

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT, {
          id: trainingModel.trainingEventId,
        })
        .mockReturnValue(mockTrainingEventParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO, {
          id: trainingModel.toyoId,
        })
        .mockReturnValue(mockToyoParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.PLAYERS, {
          id: trainingModel.playerId,
        })
        .mockReturnValue(mockPlayerParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockTrainingParseObject as any);

      mockTrainingParseObject.save.mockImplementation(
        () => mockTrainingParseObject,
      );

      const response = await repository.save(trainingModel);

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'trainingEvent',
        mockTrainingEventParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'toyo',
        mockToyoParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'player',
        mockPlayerParseObject,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'startAt',
        trainingModel.startAt,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'endAt',
        trainingModel.endAt,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'claimedAt',
        trainingModel.claimedAt,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'combination',
        trainingModel.combination,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'isTraining',
        trainingModel.isTraining,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'isAutomata',
        trainingModel.isAutomata,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'signature',
        trainingModel.signature,
      );

      expect(mockTrainingParseObject.set).toBeCalledWith(
        'combinationCorrect',
        trainingModel.isCombinationCorrect,
      );

      expect(response).toEqual(trainingModel);
    });
  });

  describe('checkIfToyoWonEventPreviosly', () => {
    it('should return true when there is more than one training with correct combination', async () => {
      const trainingEventId = 'lf93fafd';
      const toyoId = 'lfa0of';
      const isAutomata = true;

      const mockQueryConstructor = jest.mocked(Parse.Query);
      const mockQuery = {
        equalTo: jest.fn(),
        count: jest.fn(),
      };

      const mockParseObjectConstructor = jest.mocked(Parse.Object);
      const trainingEventParseObject = {};
      const toyoParseObject = {};

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT, {
          id: trainingEventId,
        })
        .mockReturnValue(trainingEventParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO, {
          id: toyoId,
        })
        .mockReturnValue(toyoParseObject as any);

      when(mockQueryConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockQuery as any);

      mockQuery.count.mockResolvedValue(2);

      const response = await repository.checkIfToyoWonEventPreviosly(
        trainingEventId,
        toyoId,
        isAutomata,
      );

      expect(mockQuery.equalTo).toBeCalledWith(
        'trainingEvent',
        trainingEventParseObject,
      );
      expect(mockQuery.equalTo).toBeCalledWith('toyo', toyoParseObject);
      expect(mockQuery.equalTo).toBeCalledWith('isAutomata', isAutomata);
      expect(mockQuery.equalTo).toBeCalledWith('combinationCorrect', true);

      expect(response).toBeTruthy();
    });

    it('should return false when there is only one training with correct combination', async () => {
      const trainingEventId = 'lf93fafd';
      const toyoId = 'lfa0of';
      const isAutomata = true;

      const mockQueryConstructor = jest.mocked(Parse.Query);
      const mockQuery = {
        equalTo: jest.fn(),
        count: jest.fn(),
      };

      const mockParseObjectConstructor = jest.mocked(Parse.Object);
      const trainingEventParseObject = {};
      const toyoParseObject = {};

      when(mockParseObjectConstructor)
        .calledWith(classes.TRAINING_EVENT, {
          id: trainingEventId,
        })
        .mockReturnValue(trainingEventParseObject as any);

      when(mockParseObjectConstructor)
        .calledWith(classes.TOYO, {
          id: toyoId,
        })
        .mockReturnValue(toyoParseObject as any);

      when(mockQueryConstructor)
        .calledWith(classes.TOYO_TRAINING)
        .mockReturnValue(mockQuery as any);

      mockQuery.count.mockResolvedValue(1);

      const response = await repository.checkIfToyoWonEventPreviosly(
        trainingEventId,
        toyoId,
        isAutomata,
      );

      expect(mockQuery.equalTo).toBeCalledWith(
        'trainingEvent',
        trainingEventParseObject,
      );
      expect(mockQuery.equalTo).toBeCalledWith('toyo', toyoParseObject);
      expect(mockQuery.equalTo).toBeCalledWith('isAutomata', isAutomata);
      expect(mockQuery.equalTo).toBeCalledWith('combinationCorrect', true);

      expect(response).toBeFalsy();
    });
  });
});
