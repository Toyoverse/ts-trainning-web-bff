import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowServiceImpl } from 'src/training-blow/services/impl/training-blow.service-impl';

describe('Training blow service tests', () => {
  const repository = {
    save: jest.fn(),
  };
  const service = new TrainingBlowServiceImpl(repository);

  describe('Create training blow', () => {
    test('Given valid input then save training blow', async () => {
      const input = new TrainingBlowCreateDto({
        name: 'Heavy Punch',
        id: '1',
      });

      const expectedModel = new TrainingBlowModel(input);

      repository.save.mockImplementation((model) => {
        return model;
      });

      const id = await service.create(input);
      expect(repository.save).toBeCalledWith(expectedModel);
      expect(id).toBe(expectedModel.id);
    });
  });
});
