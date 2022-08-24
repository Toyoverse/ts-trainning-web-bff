export class CardTrainingRewardModel {
  id?: string;
  name: string;
  description: string;
  rotText: string;
  type: string;
  cardId: string;

  constructor(attrs?: {
    id?: string;
    name: string;
    description: string;
    rotText: string;
    type: string;
    cardId: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.description = attrs.description;
      this.rotText = attrs.rotText;
      this.type = attrs.type;
      this.cardId = attrs.cardId;
    }
  }
}
