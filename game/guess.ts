import { Errors } from 'messages/errors';
import {
  Board, Guess, KeyState, Square,
} from 'types';

/**
 *
 * @param guess The Guess
 * @returns The lowest index of the Square whose letter is blank
 */
export function getUnfilledSquareIndex(guess: Guess): number {
  const { squares } = guess;
  const squareIndex = squares.reduce((curr, square, index) => {
    if (square.letter === '') {
      if (index < curr) return index;
      return curr;
    }
    return curr;
  }, squares.length);
  return squareIndex;
}

/**
 *
 * @param guess The Guess to convert to a string
 * @returns A string with each letter of the Guess concatenated in the same order as the Guess
 */
export function getGuessString(guess: Guess) {
  const { squares } = guess;
  return squares.reduce((word, square) => {
    if (square.letter !== '') return `${word}${square.letter}`;
    return word;
  }, '');
}

/**
 *
 * @param guess The Guess to check
 * @param guessLength The number of letters that should be in the Guess
 * @returns True if any of the letters in the Guess are not in the correct position, false otherwise
 */
export function guessIsWrong(guess: Guess, guessLength: number): boolean {
  const { squares } = guess;
  if (squares.length !== guessLength) throw new Error(Errors.IncorrectGuessLength(getGuessString(guess), guessLength));
  return squares.reduce((missedLetter, letter) => {
    if (letter.state !== KeyState.Position) return true;
    return missedLetter;
  }, false as boolean /** Start by assuming no misses */);
}

/**
 *
 * @param guess The array of capital-L Letters guessed
 * @param answer The array of characters in the answer
 * @returns The Guess with each squares'
 * match and position properties updated based on whether
 * the letter is in the answer and in the same position as in the answer
 */
export function updateLetterStates(guess: Guess, answer: string[]): Guess {
  /** The count of remaining matches for each character in the answer */
  const letterOccurrenceCounter = answer.reduce((accumulator, char) => ({ ...accumulator, [char]: (accumulator[char] ?? 0) + 1 }), {} as { [char: string]: number });
  /** Check each square in the Guess for a match to a letter in the answer */
  const { squares } = guess;
  /** Process letters in correct position first */
  const squaresWithPositionCalculated = squares.map((square, characterIndex) => {
    const { letter } = square;
    let { state } = square;
    if (!letter) return square;
    state = KeyState.Wrong;
    if (answer[characterIndex] === letter) {
      /** Character in Guess is in the same position in the answer */
      letterOccurrenceCounter[letter] -= 1;
      state = KeyState.Position;
    }
    /** This letter not in correct position */
    return { letter, state };
  });
  const squaresWithMatchCalculated = squaresWithPositionCalculated.map((square) => {
    const { letter } = square;
    let { state } = square;
    if (!letter || state === KeyState.Position) return square;
    if (answer.includes(letter) && letterOccurrenceCounter[letter] > 0) {
      /** Character in Guess is in answer and
      * character in Guess has remaining occurrences */
      letterOccurrenceCounter[letter] -= 1;
      state = KeyState.Match;
    }
    /** No remaining occurrences of this letter */
    return { letter, state };
  });
  return { ...guess, squares: squaresWithMatchCalculated };
}

export function getSquare(board: Board, guessIndex: number, squareIndex: number): Square {
  const guess = board[guessIndex];
  if (squareIndex < 0) throw new Error(Errors.LetterIndexSubzero);
  const { squares } = guess;
  const square = squares[squareIndex];
  return square;
}
