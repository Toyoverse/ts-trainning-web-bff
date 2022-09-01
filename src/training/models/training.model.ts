export class TrainingModel {
  id?: string;
  startAt: Date;
  endAt: Date;
  claimedAt: Date;
  signature: string;
  combination: string[];

  constructor(attrs: {
    id?: string;
    startAt: Date;
    endAt: Date;
    claimedAt: Date;
    signature: string;
    combination: string[];
  }) {
    this.id = attrs.id;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
  }
}
