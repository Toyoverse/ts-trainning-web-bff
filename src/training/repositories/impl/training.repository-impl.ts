import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { TrainingModel } from '../../../training/models/training.model';
import { TrainingRepository } from '../training.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { compareArrays, convertToTimestamp } from 'src/utils/general';
import { BlowConfigModel } from 'src/training-event/models/training-event.model';
import { TrainingEventGetCurrentDto } from 'src/training-event/dto/training-event/get-current.dto';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';

  async start(
    toyo: Parse.Object<Parse.Attributes>,
    player: Parse.Object<Parse.Attributes>,
    currentTrainingEventId: string,
    config: BlowConfigModel,
    combination: string[],
  ): Promise<TrainingModel> {
    const training = new Parse.Object(this.DATABASE_CLASS);

    try {
      const { startAt, endAt } = this.calculateTrainingDuration(config);

      const trainingEventQuery = new Parse.Query('TrainingEvent');
      trainingEventQuery.equalTo('objectId', currentTrainingEventId);
      const trainingEvent = await trainingEventQuery.first();

      training.set('toyo', toyo);
      training.set('player', player);
      training.set('startAt', startAt);
      training.set('endAt', endAt);
      training.set('trainingEvent', trainingEvent);
      training.set('combination', combination);
      training.set('isTraining', true);

      await training.save();

      const model = this.buildModelFromParseObject(training);

      return model;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async close(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    currentTrainingEvent: TrainingEventGetCurrentDto,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingModel> {
    try {
      const trainingEventQuery = new Parse.Query('TrainingEvent');
      trainingEventQuery.equalTo('objectId', currentTrainingEvent.id);
      const trainingEvent = await trainingEventQuery.first();

      const trainingEventWinnerQuery = new Parse.Query('TrainingEventWinner');
      trainingEventWinnerQuery.equalTo('toyo', toyo);
      const trainingEventWinner = await trainingEventWinnerQuery.find();

      const toyoPersonaTrainingEventQuery = new Parse.Query(
        'ToyoPersonaTrainingEvent',
      );
      toyoPersonaTrainingEventQuery.equalTo(
        'objectId',
        toyoPersonaTrainingEvent.id,
      );
      const toyoPersonaTrainingEventObj =
        await toyoPersonaTrainingEventQuery.first();

      const correctCombination: string[] = toyoPersonaTrainingEventObj.get(
        'correctBlowsCombination',
      );

      const isCombinationCorrect = compareArrays(
        training.get('combination'),
        correctCombination,
      );

      const card = toyoPersonaTrainingEventObj.get('cardReward');
      let signature: string;
      if (trainingEventWinner.length > 0 || !isCombinationCorrect) {
        signature = this.generateTrainingSignature(
          toyo.id,
          currentTrainingEvent.bondReward,
          '',
        );
      } else {
        signature = this.generateTrainingSignature(
          toyo.id,
          currentTrainingEvent.bondReward,
          card,
        );
      }

      const now = new Date();

      training.set('claimedAt', now);
      training.set('signature', signature);
      training.set('isTraining', false);

      const savedTraining = await training.save();
      const trainingModel = this.buildModelFromParseObject(savedTraining);

      if (trainingEventWinner.length === 0 && isCombinationCorrect) {
        const trainingEventWinnerObj = new Parse.Object('TrainingEventWinner');

        trainingEventWinnerObj.set('toyo', toyo);
        trainingEventWinnerObj.set('training', training);
        trainingEventWinnerObj.set('trainingEvent', trainingEvent);
        trainingEventWinnerObj.set('cardReward', card);

        await trainingEventWinnerObj.save();

        trainingModel.card = toyoPersonaTrainingEvent.cardReward;
      }

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async list(player: Parse.Object<Parse.Attributes>): Promise<TrainingModel[]> {
    try {
      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('claimedAt', undefined);
      query.equalTo('player', player);
      query.include('toyo');
      const trainingList = await query.find();

      const formattedArray = trainingList.map((e) => {
        return this.buildModelFromParseObject(e);
      });

      return formattedArray;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async verifyIfToyoIsTraining(
    toyo: Parse.Object<Parse.Attributes>,
  ): Promise<boolean> {
    const trainingQuery = new Parse.Query(this.DATABASE_CLASS);
    trainingQuery.equalTo('toyo', toyo);
    trainingQuery.equalTo('isTraining', true);
    const toyoList = await trainingQuery.find();

    if (toyoList.length > 0) {
      return true;
    }

    return false;
  }

  async getTrainingById(
    trainingId: string,
  ): Promise<Parse.Object<Parse.Attributes>> {
    const trainingQuery = new Parse.Query(this.DATABASE_CLASS);
    trainingQuery.equalTo('objectId', trainingId);
    const training = await trainingQuery.first();

    if (!training) {
      return undefined;
    }

    return training;
  }

  private buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): TrainingModel {
    const startAt = convertToTimestamp(object.get('startAt'));
    const endAt = convertToTimestamp(object.get('endAt'));
    const claimedAt = convertToTimestamp(object.get('claimedAt'));

    return new TrainingModel({
      id: object.id,
      startAt,
      endAt,
      claimedAt,
      toyoTokenId: object.get('toyo').get('tokenId'),
      signature: object.get('signature'),
      combination: object.get('combination'),
    });
  }

  private generateTrainingSignature(
    toyoId: string,
    bondAmount: number,
    cardCode: string,
  ): string {
    const eth: Eth = new Web3Eth();

    const message = soliditySha3(toyoId + bondAmount + cardCode);
    const { signature } = eth.accounts.sign(message, process.env.PRIVATE_KEY);

    return signature;
  }

  private calculateTrainingDuration(config: BlowConfigModel): {
    startAt: Date;
    endAt: Date;
  } {
    const trainingDuration = config.duration / 60;
    const startAt = new Date();
    const endAt = new Date(Date.now() + trainingDuration * (60 * 60 * 1000));

    return { startAt, endAt };
  }
}
