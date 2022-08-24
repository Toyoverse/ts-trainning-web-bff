import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { TrainingModel } from '../../../training/models/training.model';
import { TrainingRepository } from '../training.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { TrainingStartDto } from '../../../training/dto/start.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';
  private readonly TRAINING_DURATION_IN_HOURS = 8;

  async start(dto: TrainingStartDto): Promise<TrainingModel> {
    const training = new Parse.Object(this.DATABASE_CLASS);

    try {
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

      const toyoQuery = new Parse.Query('Toyo');
      toyoQuery.equalTo('objectId', dto.toyoId);
      const toyo = await toyoQuery.find();

      if (toyo.length < 1) {
        return null;
      }

      const now = new Date();
      const endAt = new Date(
        Date.now() + this.TRAINING_DURATION_IN_HOURS * (60 * 60 * 1000),
      );

      training.set('toyo', toyo[0]);
      training.set('player', player[0]);
      training.set('startAt', now);
      training.set('endAt', endAt);
      training.set('trainingEvent', trainingEvent[0]);
      training.set('combination', dto.combination);

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

      if (training.length < 1) {
        return null;
      }

      const now = new Date();
      const signature = this.generateTrainingSignature(id);

      training[0].set('claimedAt', now);
      training[0].set('signature', signature);

      const savedTraining = await training[0].save();

      const trainingModel = this.buildModelFromParseObject(savedTraining);

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async list(playerId: string): Promise<TrainingModel[]> {
    try {
      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('claimedAt', undefined);

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
      toyo: object.get('toyo'),
      startAt: object.get('startAt'),
      endAt: object.get('endAt'),
      claimedAt: object.get('claimedAt'),
      training: object.get('trainingEvent'),
      signature: object.get('signature'),
      combination: object.get('combination'),
    });
  }

  private generateTrainingSignature(trainingId: string): string {
    const eth: Eth = new Web3Eth();
    const timestamp = Date.now();

    const message = soliditySha3(timestamp + trainingId);
    const { signature } = eth.accounts.sign(message, process.env.PRIVATE_KEY);

    return signature;
  }
}
