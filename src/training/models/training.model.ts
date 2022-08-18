export class TrainingModel {
  trainingId: string;
  playerId: string;
  toyoId: string;
  sequence: string[];

  constructor(attrs: {
    trainingId: string;
    playerId: string;
    toyoId: string;
    sequence: string[];
  }) {
    this.trainingId = attrs.trainingId;
    this.playerId = attrs.playerId;
    this.toyoId = attrs.toyoId;
    this.sequence = attrs.sequence;
  }
}
