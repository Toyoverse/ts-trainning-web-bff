import * as Parse from 'parse/node';
import { Eth } from 'web3-eth';
import { keccak256, toWei } from 'web3-utils';
import { TrainingRepository } from '../training.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { compareArrays, convertToTimestamp } from 'src/utils/general';
import { BlowConfigModel } from 'src/training-event/models/training-event.model';
import { ToyoPersonaTrainingEventGetCurrentDto } from 'src/training-event/dto/toyo-persona-training-event/get-current.dto';
import { classes } from 'src/config/back4app';
import { TrainingModel } from 'src/training/models/training.model';
import { TrainingResponseDto } from 'src/training/dto/training-response.dto';
import { request, gql } from 'graphql-request';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3Eth = require('web3-eth');

export class TrainingRepositoryImpl implements TrainingRepository {
  private readonly DATABASE_CLASS = 'ToyoTraining';
  private readonly THEGRAPH_URL = process.env.THEGRAPH_URL;

  async getById(id: string): Promise<TrainingModel> {
    const parseQuery = new Parse.Query(classes.TOYO_TRAINING);
    parseQuery.equalTo('objectId', id);

    const parseObject = await parseQuery.first();

    return this._buildModelFromParseObject(parseObject);
  }

  async getByPlayerAndInTraining(playerId: string): Promise<TrainingModel[]> {
    const playerParseObject = new Parse.Object(classes.PLAYERS, {
      id: playerId,
    });

    const parseQuery = new Parse.Query(classes.TOYO_TRAINING);
    parseQuery.equalTo('player', playerParseObject);
    parseQuery.equalTo('isTraining', true);

    const parseObjects = await parseQuery.find();

    return parseObjects.map(this._buildModelFromParseObject);
  }

  private _buildModelFromParseObject(
    parseObject: Parse.Object<Parse.Attributes>,
  ): TrainingModel {
    return new TrainingModel({
      id: parseObject.id,
      trainingEventId: parseObject.get('trainingEvent').id,
      playerId: parseObject.get('player').id,
      toyoId: parseObject.get('toyo').id,
      startAt: parseObject.get('startAt'),
      endAt: parseObject.get('endAt'),
      claimedAt: parseObject.get('claimedAt'),
      combination: parseObject.get('combination'),
      isCombinationCorrect: parseObject.get('combinationCorrect'),
      isTraining: parseObject.get('isTraining'),
      isAutomata: parseObject.get('isAutomata'),
      signature: parseObject.get('signature'),
    });
  }

  async save(model: TrainingModel): Promise<TrainingModel> {
    const trainingEventParseObject = new Parse.Object(classes.TRAINING_EVENT, {
      id: model.trainingEventId,
    });

    const toyoParseObject = new Parse.Object(classes.TOYO, {
      id: model.toyoId,
    });

    const playerParseObject = new Parse.Object(classes.PLAYERS, {
      id: model.playerId,
    });

    const trainingParseObject = new Parse.Object(classes.TOYO_TRAINING);
    trainingEventParseObject.id = model.id;
    trainingParseObject.set('trainingEvent', trainingEventParseObject);
    trainingParseObject.set('toyo', toyoParseObject);
    trainingParseObject.set('player', playerParseObject);
    trainingParseObject.set('startAt', model.startAt);
    trainingParseObject.set('endAt', model.endAt);
    trainingParseObject.set('claimedAt', model.claimedAt);
    trainingParseObject.set('signature', model.signature);
    trainingParseObject.set('isTraining', model.isTraining);
    trainingParseObject.set('combination', model.combination);
    trainingParseObject.set('combinationCorrect', model.isCombinationCorrect);
    trainingParseObject.set('isAutomata', model.isAutomata);

    await trainingParseObject.save();

    model.id = trainingParseObject.id;
    return model;
  }

  async start(
    toyoId: string,
    playerId: string,
    currentTrainingEventId: string,
    config: BlowConfigModel,
    combination: string[],
  ): Promise<TrainingResponseDto> {
    const training = new Parse.Object(this.DATABASE_CLASS);
    const toyo = new Parse.Object(classes.TOYO, { id: toyoId });
    const player = new Parse.Object(classes.PLAYERS, { id: playerId });

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

  async getResult(
    training: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingResponseDto> {
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

    const combinationCorrect = compareArrays(
      training.get('combination'),
      correctCombination,
    );

    const trainingModel = this.buildModelFromParseObject(training);

    trainingModel.bond = trainingEvent.get('bondReward');

    if (combinationCorrect.isCombinationCorrect) {
      const hasWonCard: boolean = await this.checkIfToyoAlreadyHasCard(
        trainingEvent,
        training.get('toyo'),
      );
      if (!hasWonCard) {
        trainingModel.card = toyoPersonaTrainingEvent.cardReward;
      }
      trainingModel.bond =
        trainingEvent.get('bondReward') + trainingEvent.get('bonusBondReward');
    }

    trainingModel.isCombinationCorrect =
      combinationCorrect.isCombinationCorrect;
    trainingModel.combinationResult = combinationCorrect;

    return trainingModel;
  }

  async close(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
  ): Promise<TrainingResponseDto> {
    try {
      const card = training.get('cardWon');

      if (card && card.id) {
        const trainingEventWinnerObj = new Parse.Object('TrainingEventWinner');

        trainingEventWinnerObj.set('toyo', toyo);
        trainingEventWinnerObj.set('training', training);
        trainingEventWinnerObj.set('trainingEvent', trainingEvent);
        trainingEventWinnerObj.set('cardReward', card);

        await trainingEventWinnerObj.save();
      }

      training.set('claimedAt', new Date());
      training.set('isTraining', false);

      const savedTraining = await training.save();
      savedTraining.set('signature', undefined);
      const trainingModel = this.buildModelFromParseObject(savedTraining);

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getSignature(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
    trainingEvent: Parse.Object<Parse.Attributes>,
    toyoPersonaTrainingEvent: ToyoPersonaTrainingEventGetCurrentDto,
  ): Promise<TrainingResponseDto> {
    try {
      const hasWonCard: boolean = await this.checkIfToyoAlreadyHasCard(
        trainingEvent,
        training.get('toyo'),
      );

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

      const compareCombination = compareArrays(
        training.get('combination'),
        correctCombination,
      );

      const card = toyoPersonaTrainingEventObj.get('cardReward');

      const cardTrainingRewardQuery = new Parse.Query('CardTrainingReward');
      cardTrainingRewardQuery.equalTo('objectId', card.id);
      const cardTrainingRewardObj = await cardTrainingRewardQuery.first();

      const bondReward: number = compareCombination.isCombinationCorrect
        ? trainingEvent.get('bondReward') + trainingEvent.get('bonusBondReward')
        : trainingEvent.get('bondReward');

      const bondToString = bondReward.toString();

      const formattedBondAmount = toWei(bondToString, 'ether');

      let signature: string;
      if (hasWonCard || !compareCombination.isCombinationCorrect) {
        signature = this.generateTrainingSignature(
          training.id,
          toyo.get('tokenId'),
          formattedBondAmount,
          '',
        );
      } else {
        signature = this.generateTrainingSignature(
          training.id,
          toyo.get('tokenId'),
          formattedBondAmount,
          cardTrainingRewardObj.get('cardCode'),
        );

        training.set('cardWon', card);
        training.set('combinationCorrect', true);
      }

      training.set('bondWon', formattedBondAmount);
      training.set('signature', signature);

      const savedTraining = await training.save();
      const trainingModel = this.buildModelFromParseObject(savedTraining, {
        bond: trainingEvent.get('bondReward'),
        bondFormatted: formattedBondAmount,
      });

      if (!hasWonCard && compareCombination.isCombinationCorrect) {
        trainingModel.card = toyoPersonaTrainingEvent.cardReward;
      }

      return trainingModel;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
  async resetPlayerTrainings(playerId: string): Promise<void> {
    const playerParseObject = new Parse.Object(classes.PLAYERS, {
      id: playerId,
    });

    const query = new Parse.Query(classes.TOYO_TRAINING);
    query.equalTo('player', playerParseObject);

    const trainingsParseObjects = await query.find();

    await this.resetTrainings(trainingsParseObjects);
  }

  async resetTrainings(
    trainings: Parse.Object<Parse.Attributes>[],
  ): Promise<Parse.Object<Parse.Attributes>[]> {
    try {
      if (trainings.length > 0) {
        const claimedsOnChain = await this.getClaimsByWalletAddress(
          trainings[0].get('player').get('walletAddress'),
        );

        const trainingsToReset = trainings.filter((training) => {
          return !training.get('isTraining');
        });

        if (claimedsOnChain.length > trainingsToReset.length) {
          trainings.sort((a, b) => {
            return (
              new Date(b.get('updatedAt')).getTime() -
              new Date(a.get('updatedAt')).getTime()
            );
          });

          trainings[0].set('claimedAt', new Date());
          trainings[0].set('isTraining', false);
          await trainings[0].save();

          trainings.splice(0, 1);
        }
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    return trainings.filter((training) => training.get('isTraining'));
  }

  async list(playerId: string): Promise<TrainingResponseDto[]> {
    try {
      const playerParseObject = new Parse.Object(classes.PLAYERS, {
        id: playerId,
      });

      const query = new Parse.Query(this.DATABASE_CLASS);
      query.equalTo('player', playerParseObject);
      query.include('toyo');
      query.include('player');
      let trainingList = await query.findAll();

      trainingList = await this.resetTrainings(trainingList);

      const formattedArray = trainingList.map((e) => {
        return this.buildModelFromParseObject(e);
      });

      return formattedArray;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getClosedTrainingByToyo(
    toyo: Parse.Object<Parse.Attributes>,
  ): Promise<Parse.Object<Parse.Attributes>[]> {
    const query = new Parse.Query(this.DATABASE_CLASS);
    query.equalTo('toyo', toyo);
    query.exists('claimedAt');
    query.exists('signature');
    return await query.findAll();
  }

  async getTokenOwnerEntityByTokenId(tokenId: string): Promise<any[]> {
    const query = gql` {
      tokenOwnerEntities(first: 500, where: {tokenId: "${tokenId}"}) {
          typeId,
          transactionHash,
          tokenId,
          currentOwner,
          currentStaker,
          isStaked
      }
    }
  `;

    const data: any = await request(this.THEGRAPH_URL, query);
    return data?.tokenOwnerEntities;
  }

  async getClaimsByWalletAddress(owner: string): Promise<any[]> {
    const query = gql` {
      tokenClaimedEntities(first: 1000, where: {owner: "${owner}"}) {
        tokenId,
        id,
        cardCode,
        bondAmount,
        owner
      }
    }
  `;

    const data: any = await request(this.THEGRAPH_URL, query);
    return data?.tokenClaimedEntities;
  }

  async getClaimsByTokenId(tokenId: string): Promise<any[]> {
    const query = gql`
      {
        tokenClaimedEntities(first: 1000, where: {tokenId: "${tokenId.toString()}"}) {
          tokenId,
          id,
          cardCode,
          bondAmount
        }
      }
    `;

    const data: any = await request(this.THEGRAPH_URL, query);
    return data?.tokenClaimedEntities;
  }

  async verifyIfToyoIsTraining(toyoId: string): Promise<boolean> {
    const trainingQuery = new Parse.Query(this.DATABASE_CLASS);

    const toyoParseObject = new Parse.Object(classes.TOYO, {
      id: toyoId,
    });

    trainingQuery.equalTo('toyo', toyoParseObject);
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
    trainingQuery.include('cardWon');
    const training = await trainingQuery.first();

    if (!training) {
      return undefined;
    }

    return training;
  }

  private buildModelFromParseObject(
    object: Parse.Object<Parse.Attributes>,
    bondReward?: { bond: number; bondFormatted: string },
  ): TrainingResponseDto {
    const startAt = convertToTimestamp(object.get('startAt'));
    const endAt = convertToTimestamp(object.get('endAt'));
    const claimedAt = convertToTimestamp(object.get('claimedAt'));

    return new TrainingResponseDto({
      id: object.id,
      startAt,
      endAt,
      claimedAt,
      toyoTokenId: object.get('toyo').get('tokenId'),
      signature: object.get('signature'),
      combination: object.get('combination'),
      bond: bondReward?.bondFormatted || bondReward?.bond,
      isAutomata: object.get('isAutomata'),
    });
  }

  private generateTrainingSignature(
    trainingId: string,
    toyoTokenId: string,
    bondAmount: string,
    cardCode: string,
  ): string {
    const eth: Eth = new Web3Eth();

    const message = keccak256(
      eth.abi.encodeParameters(
        ['string', 'uint256', 'uint256', 'string'],
        [trainingId, toyoTokenId, bondAmount, cardCode],
      ),
    );

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

  private async checkIfToyoAlreadyHasCard(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
  ): Promise<boolean> {
    const trainingEventWinnerQuery = new Parse.Query('TrainingEventWinner');
    trainingEventWinnerQuery.equalTo('toyo', toyo);
    trainingEventWinnerQuery.equalTo('trainingEvent', training);
    const trainingEventWinner = await trainingEventWinnerQuery.find();

    if (trainingEventWinner.length > 0) {
      return true;
    }

    return false;
  }

  private async resetCardClaimByTrainingId(
    training: Parse.Object<Parse.Attributes>,
    toyo: Parse.Object<Parse.Attributes>,
  ): Promise<void> {
    const trainingEventWinnerQuery = new Parse.Query('TrainingEventWinner');
    trainingEventWinnerQuery.equalTo('toyo', toyo);
    trainingEventWinnerQuery.equalTo('training', training);
    const trainingEventWinner = await trainingEventWinnerQuery.first();

    if (trainingEventWinner) {
      const trainingEventWinnerObj = new Parse.Object('TrainingEventWinner', {
        id: trainingEventWinner.id,
      });

      trainingEventWinnerObj.destroy();
    }
  }

  async checkIfToyoWonEventPreviosly(
    trainingEventId: string,
    toyoId: string,
    isAutomata: boolean,
  ): Promise<boolean> {
    const trainingEventParseObject = new Parse.Object(classes.TRAINING_EVENT, {
      id: trainingEventId,
    });

    const toyoParseObject = new Parse.Object(classes.TOYO, { id: toyoId });

    const parseQuery = new Parse.Query(classes.TOYO_TRAINING);
    parseQuery.equalTo('trainingEvent', trainingEventParseObject);
    parseQuery.equalTo('toyo', toyoParseObject);
    parseQuery.equalTo('isAutomata', isAutomata);
    parseQuery.equalTo('combinationCorrect', true);

    const nTrainingsWon = await parseQuery.count();

    return nTrainingsWon > 1;
  }
}
