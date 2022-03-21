import {
  GameState, Req, Res,
} from 'types';
import { api } from 'pages/api/_api';
import { initGame } from 'game/initGame';
import { insertGame } from 'database/insertGame';
import { Errors } from 'messages/errors';
import { getUserFromCookie, trimAnswer } from './_util';

export default async function handler<T extends typeof api.fetchNewGame>(req: Req<T>, res: Res<T>) {
  try {
    const { name, code } = getUserFromCookie(req);
    const { gameType, date } = req.body;
    const newGame = initGame(gameType, date);
    if (!newGame) throw new Error(Errors.CantSaveGame);
    if (!name || !code) {
      res.send({ data: newGame });
      return;
    }
    const { success, error, _id } = await insertGame(newGame, name, code);
    if (error) throw new Error(error);
    if (!success) throw new Error(Errors.CantSaveGame);
    const game = { ...newGame, _id };
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
