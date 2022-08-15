import { HttpStatus } from '@nestjs/common';
import { TrainingBlowController } from 'src/training-blow/controllers/training-blow.controller';
import { TrainingBlowCreateDto } from 'src/training-blow/dto/create.dto';
import { HttpResponse } from 'src/utils/http/response';

describe('Training blow controller test', () => {
  const service = { create: jest.fn() };

  const controller = new TrainingBlowController(service);
  describe('Create training blow', () => {
    test('Given valid dto when create then create', async () => {
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
});
