import { SavedGameV1 } from "@types";
import { SAVED_GAMES_KEY } from "./saveGame";

export function getSavedGames() {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY);
  if (allGamesString) {
    return [...JSON.parse(allGamesString) as SavedGameV1[]];
  } 
  return [];
}

