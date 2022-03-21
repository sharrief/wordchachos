import { Game } from 'types';
import { getActiveSquareCoordinates } from 'game/board';
import { getSquare } from 'game/guess';

/**
 *
 * @param game The Game state
 * @returns The updated game state, with the previous Square's letter cleared
 */
export function removeLetter<T extends Game>(game: T): T {
  const { board } = game;
  const { guessIndex, squareIndex } = getActiveSquareCoordinates(board);
  if (squareIndex > 0) {
    const square = getSquare(board, guessIndex, squareIndex - 1);
    square.letter = '';
  }
  return { ...game, ...getActiveSquareCoordinates(board) };
}
