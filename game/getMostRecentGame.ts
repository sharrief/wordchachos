import { Game, GameType } from "@types";
import { SAVED_GAMES_KEY_V1 } from "./saveGame";

export function getMostRecentGame(gameType = GameType.wordle) {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY_V1);
  if (!allGamesString) return null;
  const allGames = JSON.parse(allGamesString) as Game[];
  if (!allGames?.length) return null;
  const gamesOfType = allGames
    .filter((g) => g.type === gameType)
    .sort((a, b) => {
      /** Most recent games to front of array */
      if (a.timestamp > b.timestamp) return -1;
      return 1;
    });
  if (!gamesOfType?.length) return null;
  const [mostRecentGame] = gamesOfType;
  return mostRecentGame;
}

