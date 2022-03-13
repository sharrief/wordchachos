import { getUnfilledSquareIndex } from "game";
import { Errors } from "@messages";
import { Board } from "@types";

/**
 * 
 * @param board The game Board
 * @returns The lowest index of the Guess in the Board that is not checked
 */
export function getUncheckedGuessIndex(board: Board): number {
  const guessIndex = board.reduce((curr, guess, index) => { 
    if (!guess.checked && index < curr) {
      return index; 
    }
    return curr
  }, board.length as number);
  return guessIndex;
}

/**
 * 
 * @param board The game Board
 * @returns The lowest index of the Guess in the Board that is not checked
 */
export function getGuessesUsed(board: Board): number {
  const guessesChecked = board.reduce((total, guess) => { 
    if (guess.checked) return total + 1;
    return total;
  }, 0 as number);
  return guessesChecked;
}

export function getActiveSquareCoordinates(board: Board): { guessIndex: number; squareIndex: number } {
  const guessIndex = getUncheckedGuessIndex(board);
  const currentGuess = board[guessIndex] || board[guessIndex - 1];
  const squareIndex = getUnfilledSquareIndex(currentGuess);
  return { guessIndex, squareIndex }
}