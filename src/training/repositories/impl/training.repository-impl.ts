import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { TrainingModel } from '../../../training/models/training.model';
import { TrainingRepository } from '../training.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { TrainingStartDto } from '../../../training/dto/start.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

interface BlowsConfigOptions {
  qty: number;
  duration: number;
}

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const training = new Parse.Object(this.DATABASE_CLASS);

    try {
      const toyoQuery = new Parse.Query('Toyo');
      toyoQuery.equalTo('tokenId', dto.toyoTokenId);
      const toyo = await toyoQuery.find();

      if (toyo.length < 1) {
        return null;
      }

      const trainingQuery = new Parse.Query(this.DATABASE_CLASS);
      trainingQuery.equalTo('toyo', toyo[0]);
      trainingQuery.equalTo('isTraining', true);
      const isToyoAlreadyTraining = await trainingQuery.find();

      if (isToyoAlreadyTraining.length > 0) {
        return null;
      }

      const trainingEventQuery = new Parse.Query('TrainingEvent');
      trainingEventQuery.equalTo('objectId', dto.trainingId);
      const trainingEvent = await trainingEventQuery.find();

      if (trainingEvent.length < 1 || !trainingEvent[0].get('isOngoing')) {
        return null;
      }

      const playerQuery = new Parse.Query('Players');
      playerQuery.equalTo('objectId', dto.playerId);
      const player = await playerQuery.find();

      if (player.length < 1) {
        return null;
      }

      const blowsConfigList: BlowsConfigOptions[] =
        trainingEvent[0].get('blowsConfig');

      const config = blowsConfigList.find(
        (i) => i.qty === dto.combination.length,
      );

      if (!config) {
        return null;
      }

      const trainingDuration = config.duration / 60;
      const now = new Date();
      const endAt = new Date(Date.now() + trainingDuration * (60 * 60 * 1000));

      training.set('toyo', toyo[0]);
      training.set('player', player[0]);
      training.set('startAt', now);
      training.set('endAt', endAt);
      training.set('trainingEvent', trainingEvent[0]);
      training.set('combination', dto.combination);
      training.set('isTraining', true);

      await training.save();

      const model = this.buildModelFromParseObject(training);

      return model;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async close(id: string): Promise<TrainingModel> {
    try {
      const trainingQuery = new Parse.Query(this.DATABASE_CLASS);
      trainingQuery.equalTo('objectId', id);
      const training = await trainingQuery.find();

      if (training.length < 1 || training[0].get('claimedAt') !== undefined) {
        return null;
      }

      const trainingToyo = training[0].get('toyo').id;

      const toyoQuery = new Parse.Query('Toyo');
      toyoQuery.equalTo('objectId', trainingToyo);
      const toyo = await toyoQuery.find();

      const toyoId = toyo[0].id;

      const trainingEventWinner = new Parse.Query('TrainingEventWinner');
      trainingEventWinner.equalTo('toyo', toyo[0]);
      const toyoWinner = await trainingEventWinner.find();

      const persona = toyo[0].get('toyoPersonaOrigin').id;
      const toyoPersonaQuery = new Parse.Query('ToyoPersona');
      toyoPersonaQuery.equalTo('objectId', persona);
      const resultPersona = await toyoPersonaQuery.find();

      const event = training[0].get('trainingEvent').id;
      const trainingEventQuery = new Parse.Query('TrainingEvent');
      trainingEventQuery.equalTo('objectId', event);
      const resultEvent = await trainingEventQuery.find();

      const toyoPersonaTrainingEvent = new Parse.Query(
        'ToyoPersonaTrainingEvent',
      );
      toyoPersonaTrainingEvent.equalTo('toyoPersona', resultPersona[0].id);
      toyoPersonaTrainingEvent.equalTo('trainingEvent', resultEvent[0]);
      const card = await toyoPersonaTrainingEvent.find();

      if (card.length === 0) {
        return null;
      }

      const bondReward = resultEvent[0].get('bondReward');

      let signature: string;
      if (toyoWinner.length > 0) {
        signature = this.generateTrainingSignature(toyoId, bondReward, '');
      } else {
        signature = this.generateTrainingSignature(
          toyoId,
          bondReward,
          card[0].id,
        );
      }

      const now = new Date();

      training[0].set('claimedAt', now);
      training[0].set('signature', signature);
      training[0].set('isTraining', false);

      const savedTraining = await training[0].save();

      if (toyoWinner.length === 0) {
        const trainingEventWinnerObj = new Parse.Object('TrainingEventWinner');

        trainingEventWinnerObj.set('toyo', toyo[0]);
        trainingEventWinnerObj.set('training', training[0]);
        trainingEventWinnerObj.set('trainingEvent', resultEvent[0]);

        await trainingEventWinnerObj.save();
      }

      const trainingModel = this.buildModelFromParseObject(savedTraining);

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async list(playerId: string): Promise<TrainingModel[]> {
    try {
      const playerQuery = new Parse.Query('Players');
      playerQuery.equalTo('objectId', playerId);
      const player = await playerQuery.find();

      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('claimedAt', undefined);
      query.equalTo('player', player[0]);
      const trainingList = await query.find();

      const formattedArray = trainingList.map((e) => {
        return this.buildModelFromParseObject(e);
      });

      return formattedArray;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  private buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): TrainingModel {
    return new TrainingModel({
      id: object.id,
      startAt: object.get('startAt'),
      endAt: object.get('endAt'),
      claimedAt: object.get('claimedAt'),
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
}
