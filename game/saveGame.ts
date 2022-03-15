import { Game } from 'types';

export const SAVED_GAMES_KEY_V1 = 'wordchachos-saved-games-v1';

export function saveGame(game: Game) {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY_V1);
  let allGames: Game[] = [];
  if (allGamesString) {
    const savedGames = JSON.parse(allGamesString) as Game[];
    const otherGames = savedGames.filter((g) => g.id !== game.id);
    allGames = [...otherGames, game];
  } else {
    allGames = [game];
  }
  localStorage.setItem(`${SAVED_GAMES_KEY_V1}`, JSON.stringify(allGames));
}
