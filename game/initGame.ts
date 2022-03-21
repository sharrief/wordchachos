import {
  Game, GameState, GameType, KeyState, SimpleDate,
} from 'types';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';
import { getWotD } from 'game/getWotD';

export const getUninitializedGame = (gameType = GameType.wordle, guessesAllowed = 6): Game => {
  const answer = '';
  const guessLength = 5;
  const state = KeyState.Unused;
  const board = [...Array(guessesAllowed)]
    .map(() => ({
      checked: false,
      squares: [...Array(guessLength)]
        .map(() => {
          const letter = '';
          return {
            letter, state,
          };
        }),
    }));
  return {
    board,
    guessIndex: 0,
    squareIndex: 0,
    guessesAllowed,
    guessLength,
    answer,
    seed: -1,
    guessesChecked: false,
    state: GameState.active,
    type: gameType,
    id: '',
    timestamp: 0,
    version: 1,
  };
};

export function initGame(gameType: GameType, date?: SimpleDate, guessesAllowed = 6): Game {
  const { seed, answer } = getWotD(date, gameType);
  const guessLength = answer.length;
  const timestamp = DateTime.local().valueOf();
  const id = uuid();
  return {
    ...getUninitializedGame(),
    guessesAllowed,
    guessLength,
    answer,
    seed,
    timestamp,
    id,
    type: gameType,
  };
}
