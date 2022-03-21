import { Cookie, Game, Req } from 'types';
import nodeCookie from 'cookie';

export function getUserFromCookie(req: Req) {
  const { headers } = req;
  const cookie = nodeCookie.parse(headers.cookie || '') as Cookie;
  const { name, code } = cookie;
  return { name, code };
}

export function trimAnswer<G extends Game>(game: G): G {
  return { ...game, answer: '' };
}
