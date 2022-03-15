import { Game } from 'types';
import { SAVED_GAMES_KEY_V1 } from 'game/saveGame';

export function getSavedGames() {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY_V1);
  if (allGamesString) {
    return [...JSON.parse(allGamesString) as Game[]];
  }
  return [];
}
