import { queryManyGames } from 'database/queryManyGames';
import { api } from 'pages/api/_api';
import { GameState, Req, Res } from 'types';
import { getUserFromCookie } from './_util';

export default async function handler<T extends typeof api.fetchGames>(req: Req<T>, res: Res<T>) {
  try {
    const { name, code } = getUserFromCookie(req);
    const allGames = await queryManyGames(name, code);
    const finishedGames = allGames.filter((g) => g.state !== GameState.active);
    res.send({ data: finishedGames });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
