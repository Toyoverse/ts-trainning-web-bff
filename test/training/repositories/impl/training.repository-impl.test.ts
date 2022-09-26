import { when } from 'jest-when';
import * as Parse from 'parse/node';
import { classes } from 'src/config/back4app';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepositoryImpl } from 'src/training/repositories/impl/training.repository-impl';

jest.mock('parse/node');

describe('TrainingRepositoryImpl', () => {
  const repository = new TrainingRepositoryImpl();
  describe('save', () => {
    it('should save', async () => {
      const trainingModel = new TrainingModel({
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

      const mockId = 'dfef9ef';

      mockTrainingParseObject.save.mockImplementation(() => {
        mockTrainingParseObject.id = mockId;
        return mockTrainingParseObject;
      });

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

      expect(response).toEqual({ ...trainingModel, id: mockId });
    });
  });
});
