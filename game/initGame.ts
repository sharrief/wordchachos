import { Game, GameState, GameType, KeyState, SimpleDate } from "@types";
import { getWotD } from "./getWotD";

export const getEmptyGame = (gameType = GameType.wordle, guessesAllowed = 6) => {
  const answer = '';
  const guessLength = 5;
  const state = KeyState.Unused;
  const board = [...Array(guessesAllowed)]
  .map(() => {
    return { checked: false , squares: [...Array(guessLength)]
      .map(() => {
      const letter = '';
      return {
        letter, state
      }
    })}
  });
  return {
    board,
    guessIndex: 0,
    squareIndex: 0,
    guessesAllowed,
    guessLength,
    answer,
    guessesChecked: false,
    state: GameState.active,
    type: gameType,
  }
}

export function initGame(gameType: GameType, date: SimpleDate, guessesAllowed = 6): Game {
  const answer = (getWotD(gameType, date)).toUpperCase();
  const guessLength = answer.length;
  
  return {
    ...getEmptyGame(),
    guessesAllowed,
    guessLength,
    answer,
    type: gameType,
  }
}