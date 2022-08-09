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

  @IsBoolean()
  isOngoing: boolean;

  @IsNumber()
  bondReward: number;

  @IsString()
  @IsNotEmpty()
  inTrainingMessage: string;

  @IsString()
  @IsNotEmpty()
  losesMessage: string;

  @IsString()
  @IsNotEmpty()
  rewardMessage: string;

  constructor(attrs?: {
    name: string;
    startAt: Date;
    endAt: Date;
    isOngoing: boolean;
    bondReward: number;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
  }) {
    if (attrs) {
      this.name = attrs.name;
      this.startAt = attrs.startAt;
      this.endAt = attrs.endAt;
      this.isOngoing = attrs.isOngoing;
      this.bondReward = attrs.bondReward;
      this.inTrainingMessage = attrs.inTrainingMessage;
      this.losesMessage = attrs.losesMessage;
      this.rewardMessage = attrs.rewardMessage;
    }
  }
}
