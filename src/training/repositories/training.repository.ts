import { ToyoDto } from 'src/external/player/dto/toyo.dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { BlowConfigModel } from 'src/training-event/models/training-event.model';
import { ListTrainingDto } from '../dto/list.dto';
import { TrainingResponseDto } from '../dto/training-response.dto';
import { TrainingModel } from '../models/training.model';

export interface TrainingRepository {
  start(
    toyoId: string,
    playerId: string,
    currentTrainingEventId: string,
    config: BlowConfigModel,
    combination: string[],
  ): Promise<TrainingResponseDto>;
  close(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
  ): Promise<TrainingResponseDto>;

  list(player: string): Promise<TrainingResponseDto[]>;
  verifyIfToyoIsTraining(toyoId: string): Promise<boolean>;
  getTrainingById(trainingId: string): Promise<Parse.Object<Parse.Attributes>>;
  getResult(
    training: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingResponseDto>;
  getSignature(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingResponseDto>;
  save(model: TrainingModel): Promise<TrainingModel>;
  getById(id: string): Promise<TrainingModel>;
  checkIfToyoWonEventPreviosly(
    trainingEventId: string,
    toyoId: string,
    isAutomata: boolean,
  ): Promise<boolean>;

  getByPlayerAndInTraining(playerId: string): Promise<TrainingModel[]>;
  resetPlayerTrainings(playerId: string): Promise<void>;
}
