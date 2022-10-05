import { ToyoDto } from '../dto/toyo.dto';

export interface PlayerToyoService {
  getPlayerToyos(playerId: string): Promise<ToyoDto[]>;
  getPlayerToyoAutomatas(playerId: string): Promise<ToyoDto[]>;
}
