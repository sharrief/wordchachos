import {
  Game, GameType, SimpleDate, Version,
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

function addLetter<B extends { letter: string; game: Game}>(body: B) {
  return fetchRoute<B, Game>('/api/addLetter', body);
}
function removeLetter<B extends { game: Game }>(body: B) {
  return fetchRoute<B, Game>('/api/removeLetter', body);
}
function submitGuess<B extends { game: Game}>(body: B) {
  return fetchRoute<B, Game>('/api/submitGuess', body);
}
function initGame<B extends { gameType: GameType; date: SimpleDate}>(body: B) {
  return fetchRoute<B, Game>('/api/initGame', body);
}
function getSeed<B extends SimpleDate & { gameType: GameType }>(body: B) {
  return fetchRoute<B, number>('/api/getSeed', body);
}
function getVersion() {
  return fetchRoute<null, Version>('/api/getVersion');
}
export const api = {
  addLetter,
  removeLetter,
  submitGuess,
  initGame,
  getWotDSeed: getSeed,
  getVersion,
};
