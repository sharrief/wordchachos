import { getWordleSeed } from 'game';
import { api } from 'pages/api/_api'
import { Req, Res } from '@types';

export default function handler<T extends typeof api.getWordleSeed>(req: Req<T>, res: Res<T>) {
  try {
    const { year, month, day } = req.body;
    const seed = getWordleSeed(year, month, day);
    res.send({ seed: seed });
  } catch ({ message }) {
    res.send(({ error: message }))
  }
}