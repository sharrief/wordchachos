import {
  Game, GameType, SimpleDate, User, Version,
} from 'types';

function createRequest<T>(postData: T) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  };
}
/**
 *
 * @param endpoint The URL to fetch
 * @param postData (Optional) The body for making a POST requests
 * @returns The JSON data from the server and/or an error message
 */
async function fetchRoute<T, M>(endpoint: string, postData?: T): Promise<{ error: string, data?: M}> {
  try {
    const res = (postData ? await fetch(endpoint, createRequest(postData)) : await fetch(
      endpoint,
      { credentials: 'same-origin' },
    ));
    if (res.redirected) {
      window.location.href = res.url;
    }
    const { ok, status, statusText } = res;
    if (!ok) {
      try {
        const { error } = await res.json();
        return { error };
      } catch (e) {
        return { error: `There was a server error processing the request to ${endpoint}: ${status} ${statusText}` };
      }
    }
    const { redirect, ...responseData } = await res.json();
    if (redirect) {
      window.location.href = redirect; return { error: '' };
    }
    return { ...responseData };
  } catch ({ message }) {
    return { error: message as string };
  }
}

function postGuess<B extends { guessString: string; gameType: GameType }>(body: B) {
  return fetchRoute<B, Game>('/api/postGuess', body);
}
function fetchNewGame<B extends { gameType: GameType; date: SimpleDate}>(body: B) {
  return fetchRoute<B, Game>('/api/fetchNewGame', body);
}
function fetchWordleSeed<B extends SimpleDate>(body: B) {
  return fetchRoute<B, number>('/api/fetchWordleSeed', body);
}
function fetchVersion() {
  return fetchRoute<null, Version>('/api/fetchVersion');
}
function fetchUser() {
  return fetchRoute<null, User>('/api/fetchUser');
}
function fetchGame<B extends { gameType: GameType }>(body: B) {
  return fetchRoute<B, Game>('/api/fetchGame', body);
}
function fetchGames() {
  return fetchRoute<null, Game[]>('/api/fetchGames');
}
function postUploadGames<B extends { games: Game[] }>(body: B) {
  return fetchRoute<B, Game[]>('/api/postUploadGames', body);
}
export const api = {
  postGuess,
  fetchNewGame,
  fetchWordleSeed,
  fetchVersion,
  fetchUser,
  fetchGame,
  fetchGames,
  postUploadGames,
};
