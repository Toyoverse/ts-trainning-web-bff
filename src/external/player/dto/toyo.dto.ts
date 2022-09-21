export class ToyoDto {
  id: string;
  tokenId: string;

  constructor(attrs?: { id: string; tokenId: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.tokenId = attrs.tokenId;
    }
  }
}
