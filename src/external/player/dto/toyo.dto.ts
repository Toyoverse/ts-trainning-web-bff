export class ToyoDto {
  id: string;
  tokenId: string;
  personaId: string;

  constructor(attrs?: { id: string; tokenId: string; personaId: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.tokenId = attrs.tokenId;
      this.personaId = attrs.personaId;
    }
  }
}
