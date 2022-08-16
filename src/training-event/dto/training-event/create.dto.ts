import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
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

  @IsNumber()
  bonusBondReward: number;

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

  @IsString({ each: true })
  blows: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlowConfigCreateDto)
  blowsConfig: BlowConfigCreateDto[];

  constructor(attrs?: {
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    isOngoing: boolean;
    bondReward: number;
    bonusBondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
    blows: string[];
    blowsConfig: BlowConfigCreateDto[];
  }) {
    if (attrs) {
      this.name = attrs.name;
      this.startAt = attrs.startAt;
      this.endAt = attrs.endAt;
      this.story = attrs.story;
      this.isOngoing = attrs.isOngoing;
      this.bondReward = attrs.bondReward;
      this.bonusBondReward = attrs.bonusBondReward;
      this.toyoTrainingConfirmationMessage =
        attrs.toyoTrainingConfirmationMessage;
      this.inTrainingMessage = attrs.inTrainingMessage;
      this.losesMessage = attrs.losesMessage;
      this.rewardMessage = attrs.rewardMessage;
      this.blows = attrs.blows;
      this.blowsConfig = attrs.blowsConfig;
    }
  }
}

export class BlowConfigCreateDto {
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  constructor(attrs?: { duration: number; qty: number }) {
    if (attrs) {
      this.duration = attrs.duration;
      this.qty = attrs.qty;
    }
  }
}
