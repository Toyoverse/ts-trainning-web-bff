import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class TrainingEventCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @IsNotEmpty()
  @IsString()
  story: string;

  @IsBoolean()
  isOngoing: boolean;

  @IsNumber()
  bondReward: number;

  @IsNotEmpty()
  @IsString()
  toyoTrainingConfirmationMessage: string;

  @IsString()
  @IsNotEmpty()
  inTrainingMessage: string;

  @IsString()
  @IsNotEmpty()
  losesMessage: string;

  @IsString()
  @IsNotEmpty()
  rewardMessage: string;

  blows: string[];

  constructor(attrs?: {
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    isOngoing: boolean;
    bondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
    blows: string[];
  }) {
    if (attrs) {
      this.name = attrs.name;
      this.startAt = attrs.startAt;
      this.endAt = attrs.endAt;
      this.story = attrs.story;
      this.isOngoing = attrs.isOngoing;
      this.bondReward = attrs.bondReward;
      this.toyoTrainingConfirmationMessage =
        attrs.toyoTrainingConfirmationMessage;
      this.inTrainingMessage = attrs.inTrainingMessage;
      this.losesMessage = attrs.losesMessage;
      this.rewardMessage = attrs.rewardMessage;
      this.blows = attrs.blows;
    }
  }
}
