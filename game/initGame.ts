import { Game, GameState, KeyState } from "@types";
import { getWotD } from "./getWotD";

export async function initGame(guessesAllowed = 5): Promise<Game> {
  const answer = await (await getWotD()).toUpperCase();
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
  }
}