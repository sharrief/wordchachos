export { initGame, getUninitializedGame as getEmptyGame } from './initGame';
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
export { getWordleSeed } from './getWordleSeed';
export { getWotD } from './getWotD';
export { getWordList as getWordList } from './getWordList';
export { getSavedGames } from './getSavedGames';
export { saveGame } from './saveGame'
export { getMostRecentGame } from './getMostRecentGame';