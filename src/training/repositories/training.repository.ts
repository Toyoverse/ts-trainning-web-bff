import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
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
    currentTrainingEvent: TrainingEventGetCurrentDto,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
  list(player: Parse.Object<Parse.Attributes>): Promise<TrainingModel[]>;
  verifyIfToyoIsTraining(toyoId: string): Promise<boolean>;
  getTrainingById(trainingId: string): Promise<Parse.Object<Parse.Attributes>>;
  getResult(
    training: Parse.Object<Parse.Attributes>,
    currentTrainingEvent: TrainingEventGetCurrentDto,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel>;
}
