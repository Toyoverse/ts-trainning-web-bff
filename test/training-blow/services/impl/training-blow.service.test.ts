import { NotFoundException } from '@nestjs/common';
import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { TrainingBlowGetByIdDto } from 'src/training-blow/dto/getbyid.dto';
import { TrainingBlowModel } from 'src/training-blow/models/training-blow.model';
import { TrainingBlowServiceImpl } from 'src/training-blow/services/impl/training-blow.service-impl';

describe('Training blow service tests', () => {
  const repository = {
    save: jest.fn(),
    getById: jest.fn(),
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

  describe('Get training blow by id', () => {
    test('given existing id then return training event', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const mockRepositoryResponse = new TrainingBlowModel({
        id: id,
        name: 'Heavy Punch',
      });

      const expectedResponse = new TrainingBlowGetByIdDto(
        mockRepositoryResponse,
      );

      repository.getById.mockResolvedValue(mockRepositoryResponse);

      const response = await service.getById(id);

      expect(response).toEqual(expectedResponse);
    });

    test('given not existing id then throw not found exception', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      repository.getById.mockResolvedValue(undefined);

      const t = async () => {
        await service.getById(id);
      };

      expect(t).rejects.toThrow(NotFoundException);
    });
  });
});
