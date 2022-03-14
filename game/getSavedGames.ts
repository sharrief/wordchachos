import { Game, SavedGameV1 } from "@types";
import { DateTime } from "luxon";
import { v4 as uuid } from 'uuid';
import { SAVED_GAMES_KEY } from "./saveGame";

export function getSavedGames() {
  const allGamesString = localStorage.getItem(SAVED_GAMES_KEY);
  if (allGamesString) {
    return [...JSON.parse(allGamesString) as SavedGameV1[]];
  } 
  return [];
}

