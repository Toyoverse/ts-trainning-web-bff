export class TrainingBlowGetByIdDto {
  id: string;
  name: string;
  blowId: string;

  constructor(attrs?: { id: string; name: string; blowId: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.blowId = attrs.blowId;
    }
  }
}
