import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowRepository } from 'src/training-blow/repositories/training-blow.repository';
import { TrainingBlowServiceImpl } from 'src/training-blow/services/impl/training-blow.service-impl';

describe('Training blow service tests', () => {
  const repository = {
    save: jest.fn(),
  };
  const service = new TrainingBlowServiceImpl(repository);

  describe('Create training blow', () => {
    test('Given valid input then save training blow', async () => {
      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const input = new TrainingBlowCreateDto({
        name: 'Heavy Punch',
        blowId: '1',
      });

      const expectedModel = new TrainingBlowModel(input);

      repository.save.mockImplementation((model) => {
        return new TrainingBlowModel({ ...model, id: mockId });
      });

      const id = await service.create(input);
      expect(repository.save).toBeCalledWith(expectedModel);
      expect(id).toBe(mockId);
    });
  });
});
