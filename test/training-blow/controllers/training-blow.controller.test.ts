import { HttpStatus } from '@nestjs/common';
import { TrainingBlowController } from 'src/training-blow/controllers/training-blow.controller';
import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { TrainingBlowGetByIdDto } from 'src/training-blow/dto/getbyid.dto';
import { HttpResponse } from 'src/utils/http/response';

describe('Training blow controller test', () => {
  const service = {
    create: jest.fn(),
    getById: jest.fn(),
  };

  const controller = new TrainingBlowController(service);
  describe('Create training blow', () => {
    test('Given valid dto then create', async () => {
      const mockId = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const input = new TrainingBlowCreateDto({
        id: '1',
        name: 'Heavy Punch',
      });
      const expectedResponse = new HttpResponse({
        statusCode: HttpStatus.CREATED,
        message: 'Training blow successfully created',
        body: mockId,
      });

      service.create.mockResolvedValue(mockId);

      const response = await controller.create(input);

      expect(service.create).toBeCalledWith(input);
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('Get training blow by id', () => {
    test('Given existing id the return training blow dto', async () => {
      const id = '7a6f1652-0864-4a87-be10-dc96bcddf76b';

      const expectedResponse = new TrainingBlowGetByIdDto({
        id: id,
        name: 'Heavy Punch',
        blowId: '1',
      });

      service.getById.mockResolvedValue(expectedResponse);

      const response = await controller.getById(id);

      expect(response).toEqual(expectedResponse);
    });
  });
});
