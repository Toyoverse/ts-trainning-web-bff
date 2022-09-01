export class TrainingModel {
  training: string;
  toyo: string;
  startAt: Date;
  endAt: Date;
  claimedAt: Date;
  signature: string;
  combination: string[];

  constructor(attrs: {
    training: string;
    toyo: string;
    startAt: Date;
    endAt: Date;
    claimedAt: Date;
    signature: string;
    combination: string[];
  }) {
    this.training = attrs.training;
    this.toyo = attrs.toyo;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.signature = attrs.signature;
    this.combination = attrs.combination;
  }
}
