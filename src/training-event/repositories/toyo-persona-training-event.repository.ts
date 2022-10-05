import { ToyoPersonaTrainingEventModel } from '../models/toyo-persona-training-event.model';

export interface ToyoPersonaTrainingEventRepository {
  save(
    model: ToyoPersonaTrainingEventModel,
  ): Promise<ToyoPersonaTrainingEventModel>;
  getByTrainingEventAndPersona(
    trainingEventId: string,
    toyoPersonaId: string,
    isAutomata: boolean,
  ): Promise<ToyoPersonaTrainingEventModel>;
}
