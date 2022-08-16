export class TrainingBlowModel {
  id: string;
  name: string;

  constructor(attrs?: { id?: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}
