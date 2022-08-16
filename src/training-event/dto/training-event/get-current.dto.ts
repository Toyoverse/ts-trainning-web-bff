import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class TrainingEventGetCurrentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  @Transform(({ value }) => value.getTime())
  startAt: Date;
  @ApiProperty()
  @Transform(({ value }) => value.getTime())
  endAt: Date;
  @ApiProperty()
  story: string;
  @ApiProperty()
  bondReward: number;
  @ApiProperty()
  bonusBondReward: number;
  @ApiProperty()
  toyoTrainingConfirmationMessage: string;
  @ApiProperty()
  inTrainingMessage: string;
  @ApiProperty()
  losesMessage: string;
  @ApiProperty()
  rewardMessage: string;
  @ApiProperty({ type: () => TrainingBlowGetCurrentDto })
  blows: TrainingBlowGetCurrentDto[];
  @ApiProperty({ type: () => BlowConfigGetCurrentDto })
  blowsConfig: BlowConfigGetCurrentDto[];

  constructor(attrs?: {
    id: string;
    name: string;
    startAt: Date;
    endAt: Date;
    story: string;
    bondReward: number;
    bonusBondReward: number;
    toyoTrainingConfirmationMessage: string;
    inTrainingMessage: string;
    losesMessage: string;
    rewardMessage: string;
    blows: TrainingBlowGetCurrentDto[];
    blowsConfig: BlowConfigGetCurrentDto[];
  }) {
    if (attrs) {
      Object.assign(this, attrs);
    }
  }
}

export class TrainingBlowGetCurrentDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;

  constructor(attrs?: { id: string; name: string }) {
    if (attrs) {
      this.id = attrs.id;
      this.name = attrs.name;
    }
  }
}

export class BlowConfigGetCurrentDto {
  @ApiProperty()
  duration: number;
  @ApiProperty()
  qty: number;

  constructor(attrs?: { duration: number; qty: number }) {
    if (attrs) {
      this.duration = attrs.duration;
      this.qty = attrs.qty;
    }
  }
}
