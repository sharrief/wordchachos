import { queryCurrentGame } from 'database/queryCurrentGame';
import { api } from 'pages/api/_api';
import { GameState, Req, Res } from 'types';
import { getUserFromCookie, trimAnswer } from './_util';

export default async function handler<T extends typeof api.fetchGame>(req: Req<T>, res: Res<T>) {
  try {
    const { name, code } = getUserFromCookie(req);
    const { gameType } = req.body;
    const { game, error } = await queryCurrentGame(name, code, gameType);
    if (error) throw new Error(error);
    if (game && game.state === GameState.active) {
      const trimmedGame = trimAnswer(game);
      res.send({ data: trimmedGame });
      return;
    }
    res.send({ data: game });
  } catch ({ message }) {
    res.send(({ error: message }));
  }
}
