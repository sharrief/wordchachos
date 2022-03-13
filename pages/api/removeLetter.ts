import { removeLetter } from 'game';
import { api } from 'pages/api/_api'
import { Req, Res } from '@types';

export default function handler<T extends typeof api.removeLetter>(req: Req<T>, res: Res<T>) {
  try {
    const { game } = req.body;
    const newGame = removeLetter(game);
    res.send({ data: newGame });
  } catch ({ message }) {
    res.send(({ error: message }))
  }
}