import { Game, GameState, GameType, SavedActiveGame, SavedGameV1 } from "@types";
import { DateTime } from "luxon";
import { v4 as uuid } from 'uuid';

export const ACTIVE_GAMES_KEY = 'wordchachos-active-games';

export function saveActiveGame(game: Game) {
  const timestamp = DateTime.local().valueOf();
  const id = uuid();
  const version = 1;
  const data: SavedActiveGame = { ...game, timestamp, id, version }
  const activeGamesString = localStorage.getItem(ACTIVE_GAMES_KEY);
  let allGames: Game[] = [];
  if (activeGamesString) {
    const activeGames = JSON.parse(activeGamesString) as Game[];
    /** We only save one instance per game type, so filter out active games for same game type */
    allGames = [...activeGames.filter(({ type }) => type !== game.type), data];
  } else {
    allGames = [data];
  }
  localStorage.setItem(`${ACTIVE_GAMES_KEY}`, JSON.stringify(allGames));
}

