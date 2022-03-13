import { addLetter } from 'game';
import { api } from 'pages/api/_api'
import { Req, Res } from '@types';

export default function handler<T extends typeof api.addLetter>(req: Req<T>, res: Res<T>) {
  try {
    const { letter, game } = req.body;
    const newGame = addLetter(letter, game);
    res.send({ data: newGame });
  } catch ({ message }) {
    res.send(({ error: message }))
  }
}