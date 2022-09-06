export class TrainingModel {
  id?: string;
  startAt: Date;
  endAt: Date;
  claimedAt: Date;
  toyoTokenId?: string;
  signature: string;
  combination: string[];

  constructor(attrs: {
    id?: string;
    startAt: Date;
    endAt: Date;
    claimedAt: Date;
    toyoTokenId?: string;
    signature: string;
    combination: string[];
  }) {
    this.id = attrs.id;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.toyoTokenId = attrs.toyoTokenId;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
  }
}
