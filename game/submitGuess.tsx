import { Errors } from 'messages/errors';
import { Board, Game, GameState } from 'types';
import { getActiveSquareCoordinates, getUncheckedGuessIndex, getGuessesUsed } from 'game/board';
import { getWordList } from 'game/getWordList';
import { guessIsWrong, getGuessString, updateLetterStates } from 'game/guess';

/**
 *
 * @param board The Board containing the Guesses to check
 * @param guessLength The number of letters that should be in each Guess
 * @returns True if none of the guesses are correct
 */
function allGuessesWrong(board: Board, guessLength: number): boolean {
  return board.reduce((guessesAreWrong, guess) => {
    if (!guessIsWrong(guess, guessLength)) return false;
    return guessesAreWrong;
  }, true as boolean);
}

/**
 *
 * @param game The game state
 * @param answer The answer string
 * @returns Updated board state after checking guesses
 */
function updateBoard(board: Board, answerString: string): Board {
  const answer = answerString.split('');
  const activeGuessIndex = getUncheckedGuessIndex(board);
  const newBoard = board
    .map((guess, i) => {
      if (guess.squares.length !== answer.length && activeGuessIndex === i) {
        throw new Error(Errors.GuessNotAnswerLength(getGuessString(guess), answer.length));
      }
      if (!guess.checked && activeGuessIndex === i) {
        const newLetterStates = updateLetterStates(guess, answer);
        return { ...newLetterStates, checked: true };
      }
      return guess;
    });
  return newBoard;
}

export function submitGuess(game: Game): Game {
  // TODO consider using board state to keep track of guessIndex and letterIndex... they could get out of sync with the board state
  const {
    state, board: oldBoard, answer, guessesAllowed: gAllowed, guessLength: gLength,
  } = game;
  // TODO move the default guess parameters to the game initialization logic
  const guessesAllowed = gAllowed || 5;
  const guessLength = gLength || 5;
  const guessIndex = getUncheckedGuessIndex(oldBoard);
  const uncheckedGuess = oldBoard[guessIndex];
  const guessString = getGuessString(uncheckedGuess);
  const letterCount = oldBoard[guessIndex].squares.reduce((total, square) => {
    if (square.letter) return total + 1;
    return total;
  }, 0);
  if (letterCount !== guessLength) {
    throw new Error(Errors.GuessNotAnswerLength(guessString, guessLength));
  }
  const wordList = getWordList();

  if (!wordList.find((word) => word.toUpperCase() === guessString)) {
    throw new Error(Errors.FakeWord(guessString));
  }
  if (state === GameState.active && letterCount === guessLength) {
    /** Can only submit Guesses when the game is active...
     * and when there are unused Guesses left
     */
    const newBoard = updateBoard(oldBoard, answer);
    const guessesUsed = getGuessesUsed(newBoard);
    const noCorrectGuess = allGuessesWrong(newBoard, guessLength);
    const guessesChecked = true;
    const { guessIndex: gI, squareIndex } = getActiveSquareCoordinates(newBoard);
    const updatedGame = { ...game };
    updatedGame.guessIndex = gI;
    updatedGame.squareIndex = squareIndex;
    if (noCorrectGuess) {
      if (guessesUsed === guessesAllowed) {
        /** This was the last guess. Game lost */
        return {
          ...updatedGame, board: newBoard, guessesChecked, state: GameState.loss,
        };
      }
      /** Guesses remain. Game continues */
      return { ...updatedGame, board: newBoard, guessesChecked };
    }
    return {
      ...updatedGame, board: newBoard, guessesChecked, state: GameState.win,
    };
  }
  return game;
}
