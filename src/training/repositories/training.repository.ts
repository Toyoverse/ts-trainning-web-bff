import { ToyoDto } from 'src/external/player/dto/toyo.dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { BlowConfigModel } from 'src/training-event/models/training-event.model';
import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(
    toyoId: string,
    playerId: string,
    currentTrainingEventId: string,
    config: BlowConfigModel,
    combination: string[],
  ): Promise<TrainingModel>;
  close(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
  ): Promise<TrainingModel>;
  list(player: string): Promise<TrainingModel[]>;
  verifyIfToyoIsTraining(toyoId: string): Promise<boolean>;
  getTrainingById(trainingId: string): Promise<Parse.Object<Parse.Attributes>>;
  getResult(
    training: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
  getSignature(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
}
