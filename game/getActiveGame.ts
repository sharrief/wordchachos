import { GameType, SavedActiveGame } from "@types";
import { ACTIVE_GAMES_KEY } from "./saveActiveGame";

export function getActiveGame(gameType = GameType.wordle) {
  const allGamesString = localStorage.getItem(ACTIVE_GAMES_KEY);
  if (allGamesString) {
    const games = [...JSON.parse(allGamesString) as SavedActiveGame[]];
    const matchingGameTypes = games
    .filter(({ type }) => {
      if (gameType == null) return true;
      return type === gameType;
    });
    if (!matchingGameTypes?.length) return null;
    const mostRecentGame = matchingGameTypes.reduce((acc, curr) => {
      if (curr.timestamp > acc.timestamp) return curr;
      return acc;
    });
    return mostRecentGame;
  } 
  return null;
}

