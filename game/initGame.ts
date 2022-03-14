import { Game, GameState, GameType, KeyState } from "@types";
import { getWotD } from "./getWotD";

export function initGame(gameType: GameType, guessesAllowed = 5): Game {
  const answer = (getWotD(gameType)).toUpperCase();
  const guessLength = answer.length;
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