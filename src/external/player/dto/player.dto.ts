export class PlayerDto {
  id: string;

  constructor(attrs?: { id: string }) {
    if (attrs) {
      this.id = attrs.id;
    }
  }
}
