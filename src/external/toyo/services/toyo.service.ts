export interface ToyoService {
  getToyoById(toyoId: string): Promise<Parse.Object<Parse.Attributes>>;
  getToyoByTokenId(
    toyoTokenId: string,
  ): Promise<Parse.Object<Parse.Attributes>>;
}
