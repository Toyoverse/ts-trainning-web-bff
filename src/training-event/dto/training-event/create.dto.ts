import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  story: string;

  @ApiProperty()
  @IsBoolean()
  isOngoing: boolean;

  @ApiProperty()
  @IsNumber()
  bondReward: number;

  @ApiProperty()
  @IsNumber()
  bonusBondReward: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  toyoTrainingConfirmationMessage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inTrainingMessage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  losesMessage: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rewardMessage: string;

  @ApiProperty()
  @IsString({ each: true })
  blows: string[];

  @ApiProperty({ type: () => BlowConfigCreateDto })
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

export class TrainingEventConfigDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => TrainingEventCreateDto)
  eventConfig: TrainingEventCreateDto;
}

export class BlowConfigCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty()
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
