import { Game } from 'types';

export const SAVED_GAMES_KEY_V1 = 'wordchachos-saved-games-v1';

export function saveManyGamesToCache(games: Game[]) {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY_V1);
  let allGames: Game[] = [];
  if (allGamesString) {
    const savedGames = JSON.parse(allGamesString) as Game[];
    const newGames = games.filter((g) => !savedGames.map(({ id }) => id).includes(g.id));
    const updatedGames = savedGames.map((g) => {
      const newGame = games.find(({ id }) => id === g.id);
      if (newGame) return newGame;
      return g;
    });

    allGames = [...newGames, ...updatedGames];
  } else {
    allGames = games;
  }
  if (allGames.length) {
    localStorage.setItem(`${SAVED_GAMES_KEY_V1}`, JSON.stringify(allGames));
  }
}
