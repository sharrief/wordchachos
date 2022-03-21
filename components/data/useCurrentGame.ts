import { api } from 'api/_api';
import { getCurrentLocalGame } from 'localStorage/getCurrentLocalGame';
import { saveGameToCache } from 'localStorage/saveGameToCache';
import { DateTime } from 'luxon';
import useSWR from 'swr';
import { Game, GameType, User } from 'types';
import cookies from 'js-cookie';

const devLog = process.env.NEXT_PUBLIC_DEVLOG;
export function useCurrentGame(_user?: User, _gameType = GameType.wordle, _todaysSeed = -1) {
  /** Changing game type is used to trigger a loading the game from cache. See SWR hook below */
  /** The fetcher/callback is only fired when the newGameType changes, otherwise SWR returns the cached value from previous call */
  /** SWR won't call the fetcher/callback is the first function throws bc todaysSeed seed is undefined while its SWR is in process*/
  return useSWR(() => {
    if (cookies.get('name') && !_user) return false;
    if (_gameType === GameType.random) {
      /** Use the SWR key for the random game type */
      return [`${_gameType}`, -1, _gameType, _user?.name];
    }
    /** No wordle game will be loaded until todays seed is fetched */
    if (!(_todaysSeed > 0)) throw new Error('Seed not loaded');
    /** Use the SWT key for todays wordle see */
    return [`${_gameType}-seed-${_todaysSeed}`, _todaysSeed, _gameType, _user?.name];
  }, async (_r, s, t, u) => {
    const log = (msg: string) => devLog && console.log(`getGameSWR: ${msg}`);
    const dt = DateTime.local();
    const { year, month, day } = dt;
    log(`Finding a game for ${month}/${day}/${year}. User ${u}`);
    const today = { year, month, day };
    /** Try to load from savedGames first */
    if (!u) {
      const savedGame = getCurrentLocalGame(t);
      if (savedGame) {
        log(`Saved game seed is ${savedGame.seed}. Todays is ${s}`);
        if (t === GameType.random || (s === savedGame.seed)) {
          log('Returning saved game');
          return savedGame as Game;
        }
      }
      /** No saved games (with todays seed, for wordle...) found for the GameType, so Initialize a new game */
      /** For random games, after the first such call to this SWR, new random games will be started by handleNewRandomGame */
      log(`Starting a new game with seed date ${month}/${day}/${year}`);
      const { data: game, error } = await api.fetchNewGame({ gameType: t ?? GameType.wordle, date: today });
      if (error) throw new Error(error);
      if (game) {
        log(`Saving the new game with seed ${game.seed}`);
        saveGameToCache(game);
      }
      return game as Game;
    }
    log(`Loading cloud ${t === GameType.wordle ? 'wordle' : 'random'} game for user ${u}`);
    const { data: game, error } = await api.fetchGame({ gameType: t });
    if (error) throw new Error(error);
    if (game) {
      log(`Cloud game seed is ${game.seed}. Todays is ${s}`);
      if (t === GameType.random || (s === game.seed)) {
        log('Returning cloud game');
        return game as Game;
      }
    }
    /** Init a new game */
    const { data: newGame, error: newGameError } = await api.fetchNewGame({ gameType: t ?? GameType.wordle, date: today });
    if (newGameError) throw new Error(newGameError);
    return newGame;
  }, { revalidateOnFocus: false });
}
