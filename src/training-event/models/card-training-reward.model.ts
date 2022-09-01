export class CardTrainingRewardModel {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  rotText: string;
  type: string;
  cardId: string;

  constructor(attrs?: {
    id?: string;
    name: string;
    description: string;
    imageUrl: string;
    rotText: string;
    type: string;
    cardId: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.description = attrs.description;
      this.imageUrl = attrs.imageUrl;
      this.rotText = attrs.rotText;
      this.type = attrs.type;
      this.cardId = attrs.cardId;
    }
  }

  getMetadata() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      rotText: this.rotText,
      imageUrl: this.imageUrl,
    };
  }
}
