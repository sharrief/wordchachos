import { submitGuess } from 'game';
import { api } from 'pages/api/_api'
import { Req, Res } from '@types';

export default function handler<T extends typeof api.submitGuess>(req: Req<T>, res: Res<T>) {
  try {
    const { game } = req.body;
    const newGame = submitGuess(game);
    res.send({ data: newGame });
  } catch ({ message }) {
    res.send(({ error: message }))
  }
}