import * as Parse from 'parse/node';

export enum classes {
  PLAYERS = 'Players',
  CARD_TRAINING_REWARD = 'CardTrainingReward',
  TOYO = 'Toyo',
  TOYO_PERSONA = 'ToyoPersona',
  TOYO_PERSONA_TRAINING_EVENT = 'ToyoPersonaTrainingEvent',
  TOYO_TRAINING = 'ToyoTraining',
  TRAINING_BLOW = 'TrainingBlow',
  TRAINING_EVENT = 'TrainingEvent',
  TRAINING_EVENT_WINNER = 'TrainingEventWinner',
}

export const config = () => {
  const BACK4APP_APPLICATION_ID = process.env.BACK4APP_APPLICATION_ID || '';
  const BACK4APP_JAVASCRIPT_KEY = process.env.BACK4APP_JAVASCRIPT_KEY;
  const BACK4APP_MASTER_KEY = process.env.BACK4APP_MASTER_KEY;
  const BACK4APP_SERVER_URL = process.env.BACK4APP_SERVER_URL;

  Parse.initialize(
    BACK4APP_APPLICATION_ID,
    BACK4APP_JAVASCRIPT_KEY,
    BACK4APP_MASTER_KEY,
  );

  (Parse as any).serverURL = BACK4APP_SERVER_URL;
};
