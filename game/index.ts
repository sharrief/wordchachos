export { initGame } from './initGame';
export { submitGuess } from './submitGuess';
export { addLetter } from './addLetter';
export { removeLetter } from './removeLetter';
export {
  getUncheckedGuessIndex,
  getGuessesUsed,
  getActiveSquareCoordinates,
  
} from './board';
export {
  getSquare,
  getUnfilledSquareIndex,
  guessIsWrong, 
  getGuessString, 
  updateLetterStates
} from './guess';
export { getWotD } from './getWotD';
export { getWordList as getWordList } from './getWordList';