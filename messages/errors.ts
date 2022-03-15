export const Errors = {
  FakeWord: (guess: string) => `${guess} is a fake word!`,
  GuessNotAnswerLength: (guess: string, length: number) => `Guess "${guess}" doesn't have the same number of letters as the answer (${length} letters)`,
  IncorrectGuessLength: (guess: string, length: number) => `The guess "${guess}" does not have ${length}`,
  AllGuessesChecked: 'All guesses have been checked',
  AllSquaresFilled: 'All squares have been filled',
  LetterIndexSubzero: 'Cannot remove a letter with a subzero index',
  CantGetSeed: 'There was an error loading the seed for the Wordle',
};
