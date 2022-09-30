export class TrainingModel {
  id?: string;
  trainingEventId: string;
  toyoId: string;
  playerId: string;
  startAt: Date;
  endAt: Date;
  claimedAt?: Date;
  signature?: string;
  isTraining: boolean;
  combination: string[];
  isCombinationCorrect?: boolean;
  isAutomata: boolean;

  constructor(attrs: {
    id?: string;
    trainingEventId: string;
    toyoId: string;
    playerId: string;
    startAt: Date;
    endAt: Date;
    claimedAt?: Date;
    signature?: string;
    isTraining: boolean;
    combination: string[];
    isCombinationCorrect?: boolean;
    isAutomata: boolean;
  }) {
    this.id = attrs.id;
    this.trainingEventId = attrs.trainingEventId;
    this.toyoId = attrs.toyoId;
    this.playerId = attrs.playerId;
    this.startAt = attrs.startAt;
    this.endAt = attrs.endAt;
    this.claimedAt = attrs.claimedAt;
    this.signature = attrs.signature;
    this.isTraining = attrs.isTraining;
    this.combination = attrs.combination;
    this.isCombinationCorrect = attrs.isCombinationCorrect;
    this.isAutomata = attrs.isAutomata;
  }
}
