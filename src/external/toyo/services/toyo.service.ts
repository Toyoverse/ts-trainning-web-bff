export interface ToyoService {
  getToyoById(toyoId: string): Promise<Parse.Object<Parse.Attributes>>;
}
