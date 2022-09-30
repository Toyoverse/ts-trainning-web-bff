import { ToyoDto } from '../dto/toyo/dto';

export interface ToyoService {
  getById(id: string): Promise<ToyoDto>;
  getToyoById(toyoId: string): Promise<Parse.Object<Parse.Attributes>>;
  getToyoByTokenId(
    toyoTokenId: string,
  ): Promise<Parse.Object<Parse.Attributes>>;
}
