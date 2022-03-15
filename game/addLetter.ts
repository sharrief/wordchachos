import { Game } from 'types';
import {
  getActiveSquareCoordinates,
} from 'game/board';
import {
  getSquare,
} from 'game/guess';

/**
 *
 * @param game The Game state
 * @returns The updated game state, with the current Square's letter added
 */
export function addLetter(letter: string, game: Game): Game {
  const { board } = game;
  const { guessIndex, squareIndex } = getActiveSquareCoordinates(board);
  if (squareIndex < game.guessLength) {
    const square = getSquare(board, guessIndex, squareIndex);
    square.letter = letter;
  }
  return { ...game, ...getActiveSquareCoordinates(board) };
}
