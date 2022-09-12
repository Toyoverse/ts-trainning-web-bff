import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { BlowConfigModel } from 'src/training-event/models/training-event.model';
import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(
    toyo: Parse.Object<Parse.Attributes>,
    player: Parse.Object<Parse.Attributes>,
    currentTrainingEventId: string,
    config: BlowConfigModel,
    combination: string[],
  ): Promise<TrainingModel>;
  close(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
  list(player: Parse.Object<Parse.Attributes>): Promise<TrainingModel[]>;
  verifyIfToyoIsTraining(
    toyo: Parse.Object<Parse.Attributes>,
  ): Promise<boolean>;
  getTrainingById(trainingId: string): Promise<Parse.Object<Parse.Attributes>>;
  getResult(
    training: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
}
