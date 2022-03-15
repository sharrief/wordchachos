import { Req, Res } from '@types';
import { initGame } from '../../game/initGame'
import { api } from 'pages/api/_api';
export default function handler<T extends typeof api.initGame>(req: Req<T> , res: Res<T>) {
  try {
    const { gameType, date } = req.body;
    const newGame = initGame(gameType, date);
    res.send({ data: newGame });
  } catch ({ message }) {
    res.send(({ error: message }))
  }
}