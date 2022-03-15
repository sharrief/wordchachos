import { Game, GameState, GameType, SavedGameV1 } from "@types";
import { DateTime } from "luxon";
import { v4 as uuid } from 'uuid';

export const SAVED_GAMES_KEY = 'wordchachos-saved-games';

export function saveGame(game: Game) {
  if (game.state !== GameState.active) {
    const { guessIndex, squareIndex, guessLength, guessesChecked, ...rest } = game;
    const gameToSave: SavedGameV1 = rest;
    const timestamp = DateTime.local().valueOf();
    const id = uuid();
    const version = 1;
    const data = { ...gameToSave, timestamp, id, version }
    const allGamesString = localStorage.getItem(SAVED_GAMES_KEY);
    let allGames: SavedGameV1[] = [];
    if (allGamesString) {
      const savedGames = JSON.parse(allGamesString) as SavedGameV1[];
      allGames = [...savedGames];
      const previousAttempt = savedGames.find(({ seed }) => seed === gameToSave.seed)
      if (!previousAttempt)
        allGames = [...savedGames, data];
    } else {
      allGames = [data];
    }
    localStorage.setItem(`${SAVED_GAMES_KEY}`, JSON.stringify(allGames));
  }
}

