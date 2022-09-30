export class ToyoDto {
  id: string;
  personaId: string;
  tokenId: string;

  constructor(attrs: { id: string; personaId: string; tokenId: string }) {
    this.id = attrs.id;
    this.personaId = attrs.personaId;
    this.tokenId = attrs.tokenId;
  }
}
