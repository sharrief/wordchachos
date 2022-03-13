import { Game } from "@types";
import { getActiveSquareCoordinates, getSquare } from "game";

/**
 * 
 * @param game The Game state
 * @returns The updated game state, with the previous Square's letter cleared
 */
export function removeLetter(game: Game): Game {
  const { board } = game;
  const { guessIndex, squareIndex } = getActiveSquareCoordinates(board);
  if (squareIndex > 0) {
    const square = getSquare(board, guessIndex, squareIndex - 1);
    square.letter = '';
  }
  return { ...game, ...getActiveSquareCoordinates(board) };
}

