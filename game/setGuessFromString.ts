import { Game } from 'types';
import { addLetter } from './addLetter';

export function setGuessFromString<G extends Game>(guessString: string, game: G) {
  return guessString.split('').reduce((g, l) => addLetter(l, g), game);
}
