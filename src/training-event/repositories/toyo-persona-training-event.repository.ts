import { ToyoPersonaTrainingEventModel } from '../models/toyo-persona-training-event.model';

export interface ToyoPersonaTrainingEventRepository {
  save(
    model: ToyoPersonaTrainingEventModel,
  ): Promise<ToyoPersonaTrainingEventModel>;
  getByTrainingEventAndToyoPersona(
    trainingEventId: string,
    toyoPersonaId: string,
  ): Promise<ToyoPersonaTrainingEventModel>;
}
