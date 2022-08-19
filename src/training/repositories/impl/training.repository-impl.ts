import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepository } from '../training.repository';
import { InternalServerErrorException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';
  private readonly TRAINING_DURATION_IN_HOURS = 8;

  async start(model: TrainingModel): Promise<TrainingModel> {
    const training = new Parse.Object(this.DATABASE_CLASS);

    try {
      const trainingEvent = await this.findByObjectId(
        'TrainingEvent',
        model.trainingId,
      );
      const player = await this.findByObjectId('Players', model.playerId);
      const toyo = await this.findByObjectId('Toyo', model.toyoId);

      const now = new Date();
      const endAt = new Date(
        Date.now() + this.TRAINING_DURATION_IN_HOURS * (60 * 60 * 1000),
      );

      training.set('toyo', toyo);
      training.set('player', player);
      training.set('startAt', now);
      training.set('endAt', endAt);
      training.set('trainingEvent', trainingEvent);
      training.set('combination', model.sequence);

      await training.save();

      return model;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async close(id: string): Promise<TrainingModel> {
    try {
      const training = await this.findByObjectId(this.DATABASE_CLASS, id);

      const now = new Date();
      const signature = this.generateTrainingSignature(id);

      training.set('claimedAt', now);
      training.set('signature', signature);

      await training.save();

      const trainingModel = this.buildModelFromParseObject(training);

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async list(): Promise<any> {
    try {
      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('claimedAt', undefined);

      const trainingList = query.find();

      return trainingList;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  private buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
  ): TrainingModel {
    return new TrainingModel({
      playerId: object.get('player'),
      sequence: object.get('sequence'),
      toyoId: object.get('toyo'),
      trainingId: object.get('signature'),
    });
  }

  private generateTrainingSignature(trainingId: string): string {
    const eth: Eth = new Web3Eth();
    const timestamp = Date.now();

    const message = soliditySha3(timestamp + trainingId);
    const { signature } = eth.accounts.sign(message, process.env.PRIVATE_KEY);

    return signature;
  }

  private async findByObjectId(
    obj: string,
    objectId: string,
  ): Promise<Parse.Object<Parse.Attributes>> {
    const Obj = Parse.Object.extend(obj);
    const query: Parse.Query = new Parse.Query(Obj);
    const result = await query.get(objectId);

    return result;
  }
}
