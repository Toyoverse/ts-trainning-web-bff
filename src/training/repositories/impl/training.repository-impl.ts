import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { soliditySha3 } from 'web3-utils';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingRepository } from '../training.repository';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';

  async start(model: TrainingModel): Promise<TrainingModel> {
    const trainingObj = new Parse.Object(this.DATABASE_CLASS);

    try {
      const trainingEventQuery = this.generateObjectQuery('TrainingEvent');
      trainingEventQuery.equalTo('objectId', model.trainingId);

      const ongoingEvent = await trainingEventQuery.find();

      const playerQuery = this.generateObjectQuery('Players');
      playerQuery.equalTo('objectId', model.playerId);

      const player = await playerQuery.find();

      const toyoQuery = this.generateObjectQuery('Toyo');
      toyoQuery.equalTo('objectId', model.toyoId);

      const toyo = await toyoQuery.find();

      const now = new Date();
      const endAt = new Date(Date.now() + 8 * (60 * 60 * 1000));

      trainingObj.set('toyo', toyo[0]);
      trainingObj.set('player', player[0]);
      trainingObj.set('startAt', now);
      trainingObj.set('endAt', endAt);
      trainingObj.set('trainingEvent', ongoingEvent[0]);
      trainingObj.set('combination', model.sequence);

      await trainingObj.save();

      return model;
    } catch (e) {
      throw new Error(e);
    }
  }

  async close(id: string): Promise<any> {
    try {
      const query = this.generateObjectQuery(this.DATABASE_CLASS);
      query.equalTo('objectId', id);

      const training = await query.first();

      const now = new Date();
      const signature = this.generateTrainingSignature(id);

      training.set('claimedAt', now);
      training.set('signature', signature);

      await training.save();

      return training;
    } catch (e) {
      throw new Error(e);
    }
  }

  async list(): Promise<any> {
    try {
      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('claimedAt', undefined);

      const trainingList = query.find();

      return trainingList;
    } catch (e) {
      throw new Error(e);
    }
  }

  private generateTrainingSignature(trainingId: string): string {
    const eth: Eth = new Web3Eth();
    const timestamp = Date.now();

    const message = soliditySha3(timestamp + trainingId);
    const { signature } = eth.accounts.sign(message, process.env.PRIVATE_KEY);

    return signature;
  }

  private generateObjectQuery(obj: string): Parse.Query {
    const Obj = Parse.Object.extend(obj);
    const query: Parse.Query = new Parse.Query(Obj);

    return query;
  }
}
