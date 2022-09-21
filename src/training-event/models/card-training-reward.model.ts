export class CardTrainingRewardModel {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  rotText: string;
  type: string;
  cardId: string;
  cardCode?: string;

  constructor(attrs?: {
    id?: string;
    name: string;
    description: string;
    imageUrl: string;
    rotText: string;
    type: string;
    cardId: string;
    cardCode?: string;
  }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
      this.description = attrs.description;
      this.imageUrl = attrs.imageUrl;
      this.rotText = attrs.rotText;
      this.type = attrs.type;
      this.cardId = attrs.cardId;
      this.cardCode = attrs.cardCode;
    }
  }

  getMetadata() {
    return {
      name: this.name,
      description: this.description,
      rotText: this.rotText,
      imageUrl: this.imageUrl,
    };
  }
}
